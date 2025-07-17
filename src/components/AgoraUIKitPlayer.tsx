'use client';

import { useEffect, useRef, useState } from 'react';

interface AgoraUIKitPlayerProps {
  appId: string;
  channel: string;
  token: string;
  //uid?: number;
  className?: string;
}

export const AgoraUIKitPlayer = ({
  appId,
  channel,
  token,
  //uid = 0,
  className = '',
}: AgoraUIKitPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const clientRef = useRef<any>(null);

  useEffect(() => {
    const initAgora = async () => {
      try {
        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

        if (!AgoraRTC.checkSystemRequirements()) {
          setError('Browser not supported');
          return;
        }

        const client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' });
        clientRef.current = client;

        await client.setClientRole('audience');

        client.on(
          'user-published',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async (user: any, mediaType: 'video' | 'audio') => {
            await client.subscribe(user, mediaType);
            if (mediaType === 'video' && videoRef.current) {
              user.videoTrack?.play(videoRef.current);
            }
          }
        );

        //await client.join(appId, channel, token, uid);
        await client.join(appId, channel, token);
        setIsConnected(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error('Agora error:', err);
        if (err.code === 'UID_CONFLICT') {
          setError('Connection conflict - please try again');
        } else if (err.code === 'INVALID_PARAMS') {
          setError('Invalid stream parameters');
        } else {
          setError('Failed to connect to stream');
        }
      }
    };

    if (appId && channel) {
      initAgora();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.leave().catch(console.error);
      }
    };
    //}, [appId, channel, token, uid]);
  }, [appId, channel, token]);

  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-red-900 text-white ${className}`}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={`relative bg-black ${className}`}>
      <div
        ref={videoRef}
        className="w-full h-full"
        style={{ transform: 'rotate(0deg)' }} // Change to '90deg', '180deg', etc. as needed
      />
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
          <p>Connecting...</p>
        </div>
      )}
    </div>
  );
};
