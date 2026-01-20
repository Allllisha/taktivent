import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UsePollingOptions {
  queryKey: string[];
  interval?: number;
  enabled?: boolean;
}

export function usePolling({ queryKey, interval = 5000, enabled = true }: UsePollingOptions) {
  const queryClient = useQueryClient();
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = window.setInterval(() => {
      queryClient.invalidateQueries({ queryKey });
    }, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [queryClient, queryKey, interval, enabled]);
}

export default usePolling;
