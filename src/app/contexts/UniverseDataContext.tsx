/**
 * UniverseDataContext - Context for universe data management
 * 
 * This context manages the data layer for universes:
 * - Fetches universes from Supabase database
 * - Caches universes in localStorage for offline support
 * - Prevents race conditions with refresh ID tracking
 * - Handles page loading for each universe
 * - Provides fallback to localStorage on database errors
 * 
 * Features:
 * - Automatic refresh on session changes
 * - Parallel page loading for better performance
 * - LocalStorage persistence for offline access
 * - Race condition prevention with refresh IDs
 * - Error handling with graceful fallbacks
 * 
 * Data Flow:
 * 1. User logs in → refreshUniverses() called
 * 2. Fetch universes from database
 * 3. Load pages for each universe in parallel
 * 4. Save to localStorage
 * 5. Update state
 * 
 * TODO: Add optimistic updates
 * TODO: Add real-time sync with Supabase
 * TODO: Add conflict resolution for concurrent edits
 */

import { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../utils/AuthContext';
import * as db from '../utils/database';
import { Universe } from '../types';

type UniverseDataContextType = {
  universes: Universe[];
  loading: boolean;
  refreshUniverses: () => Promise<void>;
  saveUniverses: (universes: Universe[]) => Promise<void>;
};

const UniverseDataContext = createContext<UniverseDataContextType | null>(null);

export const UniverseDataProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, user } = useAuth();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const refreshIdRef = useRef<number>(0);

  const saveUniverses = useCallback(async (newUniverses: Universe[]) => {
    setUniverses(newUniverses);
    // Only save to localStorage if there are actual changes
    try {
      const currentData = localStorage.getItem('the-architect-universes');
      const newData = JSON.stringify(newUniverses);
      if (currentData !== newData) {
        localStorage.setItem('the-architect-universes', newData);
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, []);

  const refreshUniverses = useCallback(async () => {
    if (!user) {
      setUniverses([]);
      setLoading(false);
      return;
    }

    // Prevent multiple simultaneous refreshes
    const refreshId = ++refreshIdRef.current;

    try {
      setLoading(true);
      console.log('Fetching universes for user:', user.id);

      // Check if database functions are available
      if (!db.getUniverses || !db.getPages) {
        throw new Error('Database functions not available');
      }

      const universesData = await db.getUniverses(user.id);
      console.log('Universes data:', universesData);

      // Check if this refresh is still the latest one
      if (refreshIdRef.current !== refreshId) {
        console.log('Refresh cancelled due to newer request');
        return;
      }

      // Load pages for each universe in parallel with error handling
      const universesWithPages = await Promise.all(
        universesData.map(async (universe) => {
          try {
            const pages = await db.getPages(universe.id);
            return { ...universe, pages };
          } catch (pageError) {
            console.error(`Failed to load pages for universe ${universe.id}:`, pageError);
            return { ...universe, pages: [] };
          }
        })
      );

      // Final check before updating state
      if (refreshIdRef.current !== refreshId) {
        console.log('State update cancelled due to newer request');
        return;
      }

      console.log('Universes with pages:', universesWithPages);
      setUniverses(universesWithPages);
      await saveUniverses(universesWithPages);
    } catch (error) {
      console.error('Failed to fetch universes:', error);
      // Only update state if this is still the current refresh
      if (refreshIdRef.current === refreshId) {
        // Fallback to local storage if database fails
        try {
          const localData = localStorage.getItem('the-architect-universes');
          if (localData) {
            console.log('Using fallback local data');
            setUniverses(JSON.parse(localData));
          } else {
            console.log('No local data found, setting empty array');
            setUniverses([]);
          }
        } catch (err) {
          console.error("Failed to parse local universes", err);
          setUniverses([]);
        }
      }
    } finally {
      // Only update loading state if this is still the current refresh
      if (refreshIdRef.current === refreshId) {
        setLoading(false);
      }
    }
  }, [user, saveUniverses]);

  useEffect(() => {
    if (session) {
      refreshUniverses().catch(error => {
        console.error('Error in refreshUniverses:', error);
        setLoading(false);
      });
    } else {
      setUniverses([]);
      setLoading(false);
    }
  }, [session, refreshUniverses]);

  useEffect(() => {
    return () => {
      // Cleanup function to prevent state updates on unmounted component
      setLoading(false);
    };
  }, []);

  const contextValue = {
    universes,
    loading,
    refreshUniverses,
    saveUniverses
  };

  return (
    <UniverseDataContext.Provider value={contextValue}>
      {children}
    </UniverseDataContext.Provider>
  );
};

export const useUniverseData = () => {
  const ctx = useContext(UniverseDataContext);
  if (!ctx) throw new Error('useUniverseData must be used within UniverseDataProvider');
  return ctx;
};
