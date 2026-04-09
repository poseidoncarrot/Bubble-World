import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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
    const refreshId = Date.now();
    (refreshUniverses as any).currentId = refreshId;

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
      if ((refreshUniverses as any).currentId !== refreshId) {
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
      if ((refreshUniverses as any).currentId !== refreshId) {
        console.log('State update cancelled due to newer request');
        return;
      }
      
      console.log('Universes with pages:', universesWithPages);
      setUniverses(universesWithPages);
      await saveUniverses(universesWithPages);
    } catch (error) {
      console.error('Failed to fetch universes:', error);
      // Only update state if this is still the current refresh
      if ((refreshUniverses as any).currentId === refreshId) {
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
      if ((refreshUniverses as any).currentId === refreshId) {
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
