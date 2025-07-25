'use client';

import { useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IAgoraRTCClient = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IAgoraRTCRemoteUser = any;

interface AgoraVideoPlayerProps {
  appId: string;
  channel: string;
  token: string | null;
  className?: string;
}

export const AgoraVideoPlayer = ({
  appId,
  channel,
  token,
  className = '',
}: AgoraVideoPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAgora = async () => {
      try {
        const { default: AgoraRTC } = await import('agora-rtc-sdk-ng');

        if (!AgoraRTC.checkSystemRequirements()) {
          setError('WebRTC not supported');
          return;
        }

        const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
        clientRef.current = client;

        // Set client role to audience
        await client.setClientRole('audience');

        // Handle remote user events
        client.on(
          'user-published',
          async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
            try {
              await client.subscribe(user, mediaType);

              if (mediaType === 'video' && videoRef.current) {
                user.videoTrack?.play(videoRef.current);
              }
            } catch (subscribeError) {
              console.error('Subscribe error:', subscribeError);
            }
          }
        );

        client.on('user-unpublished', (user: IAgoraRTCRemoteUser) => {
          if (user.videoTrack) {
            user.videoTrack.stop();
          }
        });

        client.on(
          'connection-state-change',
          (curState: string, revState: string) => {
            console.log('Connection state changed:', curState, revState);
          }
        );

        // Join channel with error handling
        await client.join(appId, channel, token);
        setIsConnected(true);
        setError(null);
      } catch (err: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error = err as any;
        console.error('Failed to initialize Agora:', err);
        let errorMessage = 'Failed to connect to stream';

        if (error.code === 'NOT_SUPPORTED') {
          errorMessage = 'WebRTC not supported in this browser';
        } else if (error.code === 'WEB_SECURITY_RESTRICT') {
          errorMessage = 'Please use HTTPS or localhost';
        }

        setError(errorMessage);
      }
    };

    if (typeof window !== 'undefined' && appId && channel) {
      initAgora();
    }

    return () => {
      if (clientRef.current) {
        try {
          clientRef.current.leave();
        } catch (err) {
          console.error('Error leaving channel:', err);
        }
        clientRef.current = null;
      }
      setIsConnected(false);
    };
  }, [appId, channel, token]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-900 text-white ${className}`}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`relative bg-black ${className}`}>
      <div ref={videoRef} className="w-full h-full" />
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <p>Connecting to stream...</p>
        </div>
      )}
    </div>
  );
};
