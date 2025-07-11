import { useState, useEffect, useCallback } from 'react';
import { Broadcaster, StreamDetails } from '@/types/streaming';
import { streamingService } from '@/services/streamingService';

export const useStreaming = () => {
  const [broadcasters, setBroadcasters] = useState<Broadcaster[]>([]);
  const [loading, setLoading] = useState(true); // Start with loading true
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchBroadcasters = useCallback(
    async (isRetry = false) => {
      if (!isRetry) {
        setLoading(true);
      }
      setError(null);

      try {
        const data = await streamingService.getBroadcasters();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setBroadcasters(data);
          setRetryCount(0);
        } else {
          console.error('Invalid broadcaster data format:', data);
          setBroadcasters([]);
          setError('Invalid data format received');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch broadcasters';
        console.error('Fetch broadcasters error:', err);
        setError(errorMessage);
        setBroadcasters([]);

        // Auto-retry up to 3 times with exponential backoff
        if (retryCount < 3) {
          const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
          setTimeout(() => {
            setRetryCount((prev) => prev + 1);
            fetchBroadcasters(true);
          }, delay);
        }
      } finally {
        setLoading(false);
      }
    },
    [retryCount]
  );

  const getStreamDetails = async (
    streamId: string
  ): Promise<StreamDetails | null> => {
    if (!streamId || typeof streamId !== 'string') {
      setError('Invalid stream ID');
      return null;
    }

    try {
      const details = await streamingService.getStreamDetails(streamId);
      setError(null); // Clear any previous errors
      return details;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch stream details';
      console.error('Get stream details error:', err);
      setError(errorMessage);
      return null;
    }
  };

  const clearError = () => setError(null);

  const retry = () => {
    setRetryCount(0);
    fetchBroadcasters();
  };

  useEffect(() => {
    fetchBroadcasters();
  }, [fetchBroadcasters]);

  return {
    broadcasters,
    loading,
    error,
    retryCount,
    fetchBroadcasters,
    getStreamDetails,
    clearError,
    retry,
  };
};
