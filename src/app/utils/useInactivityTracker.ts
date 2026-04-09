import { useCallback, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds
const STORAGE_KEY = 'last_activity_timestamp';
const WARNING_STORAGE_KEY = 'logout_warning_timestamp';

export const useInactivityTracker = () => {
  const { signOut, user } = useAuth();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearActivityTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
  }, []);

  const signOutUser = useCallback(async () => {
    clearActivityTimeout();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(WARNING_STORAGE_KEY);
    await signOut();
  }, [signOut, clearActivityTimeout]);

  const resetActivityTimer = useCallback(() => {
    if (!user) return;

    const now = Date.now();
    localStorage.setItem(STORAGE_KEY, now.toString());
    localStorage.removeItem(WARNING_STORAGE_KEY);

    clearActivityTimeout();

    // Set timeout for automatic logout
    timeoutRef.current = setTimeout(() => {
      signOutUser();
    }, INACTIVITY_TIMEOUT);

    // Set timeout for warning (optional - 30 seconds before logout)
    warningTimeoutRef.current = setTimeout(() => {
      const warningTime = Date.now();
      localStorage.setItem(WARNING_STORAGE_KEY, warningTime.toString());
      console.warn('You will be logged out due to inactivity in 30 seconds');
    }, INACTIVITY_TIMEOUT - 30000);
  }, [user, clearActivityTimeout, signOutUser]);

  const checkStoredActivity = useCallback(() => {
    if (!user) return;

    const storedTimestamp = localStorage.getItem(STORAGE_KEY);
    const warningTimestamp = localStorage.getItem(WARNING_STORAGE_KEY);

    if (storedTimestamp) {
      const lastActivity = parseInt(storedTimestamp, 10);
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;

      if (timeSinceLastActivity >= INACTIVITY_TIMEOUT) {
        // User has been inactive for too long, sign them out
        signOutUser();
        return;
      }

      if (warningTimestamp) {
        const warningTime = parseInt(warningTimestamp, 10);
        const timeSinceWarning = now - warningTime;
        
        // If warning was shown more than 30 seconds ago, sign out
        if (timeSinceWarning >= 30000) {
          signOutUser();
          return;
        }
      }

      // Reset timer with remaining time
      const remainingTime = INACTIVITY_TIMEOUT - timeSinceLastActivity;
      timeoutRef.current = setTimeout(() => {
        signOutUser();
      }, remainingTime);

      // Set warning if needed
      if (remainingTime <= 30000 && !warningTimestamp) {
        warningTimeoutRef.current = setTimeout(() => {
          const warningTime = Date.now();
          localStorage.setItem(WARNING_STORAGE_KEY, warningTime.toString());
          console.warn('You will be logged out due to inactivity in 30 seconds');
        }, remainingTime - 30000);
      }
    } else {
      // No stored activity, start fresh
      resetActivityTimer();
    }
  }, [user, signOutUser, resetActivityTimer]);

  useEffect(() => {
    if (!user) {
      clearActivityTimeout();
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(WARNING_STORAGE_KEY);
      return;
    }

    // Check stored activity on mount
    checkStoredActivity();

    // Track various user activities with throttling for performance
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click',
      'keydown', 'keyup', 'focus', 'blur', 'change', 'input', 'submit'
    ];

    // Throttle high-frequency events to improve performance
    let lastActivityTime = 0;
    const ACTIVITY_THROTTLE = 1000; // 1 second throttle

    const handleActivity = () => {
      const now = Date.now();
      if (now - lastActivityTime > ACTIVITY_THROTTLE) {
        lastActivityTime = now;
        resetActivityTimer();
      }
    };

    // Special handling for high-frequency events
    const handleMouseMove = (e: MouseEvent) => {
      // Only count mouse movement if it's significant
      if (e.movementX !== 0 || e.movementY !== 0) {
        handleActivity();
      }
    };

    // Add event listeners with optimized options
    activityEvents.forEach(event => {
      if (event === 'mousemove') {
        document.addEventListener(event, handleMouseMove, { passive: true, capture: true });
      } else if (event === 'scroll') {
        document.addEventListener(event, handleActivity, { passive: true, capture: true });
      } else {
        document.addEventListener(event, handleActivity, true);
      }
    });

    // Handle visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        checkStoredActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle page unload
    const handleUnload = () => {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      clearActivityTimeout();
      activityEvents.forEach(event => {
        if (event === 'mousemove') {
          document.removeEventListener(event, handleMouseMove, true);
        } else if (event === 'scroll') {
          document.removeEventListener(event, handleActivity, { capture: true } as any);
        } else {
          document.removeEventListener(event, handleActivity, true);
        }
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [user, clearActivityTimeout, checkStoredActivity, resetActivityTimer]);

  return {
    resetActivityTimer,
    clearActivityTimeout
  };
};
