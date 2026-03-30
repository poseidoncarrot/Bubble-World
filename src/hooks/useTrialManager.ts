import { useState, useEffect, useCallback } from 'react';
import { UserSession } from '@/types';
import { LocalStorageManager, generateSessionId } from '@/services/localStorage';

export const useTrialManager = (
  onTrialExpire: () => void,
  onSignupPrompt: () => void
) => {
  const [session, setSession] = useState<UserSession | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(300); // 5 minutes in seconds
  const [isExpired, setIsExpired] = useState(false);

  // Initialize trial session
  useEffect(() => {
    const sessionId = generateSessionId();
    const trialSession: UserSession = {
      id: crypto.randomUUID(),
      session_id: sessionId,
      trial_started_at: new Date().toISOString(),
      trial_expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
      is_premium: false,
      created_at: new Date().toISOString()
    };

    const storage = new LocalStorageManager(sessionId);
    storage.saveSession(trialSession);
    setSession(trialSession);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!session || isExpired) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const expiry = new Date(session.trial_expires_at).getTime();
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));

      setTimeRemaining(remaining);

      if (remaining === 0) {
        setIsExpired(true);
        onTrialExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, isExpired, onTrialExpire]);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        onSignupPrompt();
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [onSignupPrompt]);

  // Format time remaining
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Check if trial is expired
  const checkTrialExpired = useCallback((): boolean => {
    if (!session) return true;
    
    const now = new Date().getTime();
    const expiry = new Date(session.trial_expires_at).getTime();
    return now >= expiry;
  }, [session]);

  // Extend trial (for testing or special cases)
  const extendTrial = useCallback((minutes: number) => {
    if (!session) return;

    const newExpiry = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    const updatedSession = {
      ...session,
      trial_expires_at: newExpiry
    };

    const storage = new LocalStorageManager(session.session_id);
    storage.saveSession(updatedSession);
    setSession(updatedSession);
    setIsExpired(false);
  }, [session]);

  // Convert to premium user
  const convertToPremium = useCallback(() => {
    if (!session) return;

    const premiumSession = {
      ...session,
      is_premium: true
    };

    const storage = new LocalStorageManager(session.session_id);
    storage.saveSession(premiumSession);
    setSession(premiumSession);
  }, [session]);

  return {
    session,
    timeRemaining,
    formattedTime: formatTime(timeRemaining),
    isExpired,
    isTrialActive: !isExpired && !!session,
    checkTrialExpired,
    extendTrial,
    convertToPremium
  };
};
