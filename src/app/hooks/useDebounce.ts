import { useMemo } from 'react';

export const useDebounce = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const debouncedCallback = useMemo(
    () => {
      let timeoutId: ReturnType<typeof setTimeout>;
      return (...args: Parameters<T>) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          callback(...args);
        }, delay);
      };
    },
    [callback, delay]
  );

  return debouncedCallback as T;
};

export const useDebouncedUpdate = () => {
  const debouncedUpdate = useMemo(
    () => {
      const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

      return (key: string, callback: () => void, delay: number = 500) => {
        // Clear existing timeout for this key
        if (timeouts.has(key)) {
          clearTimeout(timeouts.get(key)!);
        }

        // Set new timeout
        const timeoutId = setTimeout(() => {
          callback();
          timeouts.delete(key);
        }, delay);

        timeouts.set(key, timeoutId);
      };
    },
    []
  );

  return debouncedUpdate;
};
