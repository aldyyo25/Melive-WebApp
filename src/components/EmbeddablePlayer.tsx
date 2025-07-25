'use client';

import { useEffect, useState } from 'react';
import { AgoraVideoPlayerWrapper } from './AgoraVideoPlayerWrapper';
import { streamingService } from '@/services/streamingService';
import { StreamDetails } from '@/types/streaming';

interface EmbeddablePlayerProps {
  streamId: string;
  width?: string;
  height?: string;
  autoplay?: boolean;
}

export const EmbeddablePlayer = ({
  streamId,
  width = '100%',
  height = '400px',
}: EmbeddablePlayerProps) => {
  const [streamDetails, setStreamDetails] = useState<StreamDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStreamDetails = async () => {
      try {
        const details = await streamingService.getStreamDetails(streamId);
        setStreamDetails(details);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load stream');
      } finally {
        setLoading(false);
      }
    };

    if (streamId) {
      fetchStreamDetails();
    }
  }, [streamId]);

  if (loading) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center bg-gray-900 text-white rounded"
      >
        <p>Loading stream...</p>
      </div>
    );
  }

  if (error || !streamDetails) {
    return (
      <div
        style={{ width, height }}
        className="flex items-center justify-center bg-gray-900 text-white rounded"
      >
        <p>Stream unavailable</p>
      </div>
    );
  }

  return (
    <div style={{ width, height }} className="rounded overflow-hidden">
      <AgoraVideoPlayerWrapper
        appId={streamDetails.app_id}
        channel={streamDetails.channel}
        token={streamDetails.agora_token ?? ''}
        uid={streamDetails.uid}
        className="w-full h-full"
      />
    </div>
  );
};
