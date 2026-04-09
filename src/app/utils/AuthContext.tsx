/**
 * AuthContext - Authentication state management
 * 
 * This context manages user authentication state using Supabase:
 * - Tracks current user and session
 * - Listens to auth state changes
 * - Provides sign out functionality
 * - Integrates with inactivity tracker for auto-logout
 * 
 * Features:
 * - Automatic session detection on mount
 * - Real-time auth state updates via Supabase subscription
 * - Loading state during initial auth check
 * - Auto-logout on inactivity (via useInactivityTracker)
 * - Cleanup on unmount
 * 
 * Auth Flow:
 * 1. On mount, check for existing session
 * 2. Subscribe to auth state changes
 * 3. Update user/session on changes
 * 4. Cleanup subscription on unmount
 * 
 * TODO: Add session refresh logic
 * TODO: Add auth error handling
 * TODO: Add multi-factor auth support
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from './supabase';
import { User, Session } from '@supabase/supabase-js';
import { useInactivityTracker } from './useInactivityTracker';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  session: null, 
  loading: true,
  signOut: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize inactivity tracker
  useInactivityTracker();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
