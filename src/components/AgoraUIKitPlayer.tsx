'use client';

import { useEffect, useRef, useState } from 'react';
import { isSecureEnvironment, getSecurityError, getEnvironmentInfo } from '@/utils/securityCheck';

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
        // Check security environment
        const securityError = getSecurityError();
        if (securityError) {
          console.warn('Security check failed:', securityError);
          console.info('Environment info:', getEnvironmentInfo());
          setError(securityError);
          return;
        }

        console.log('Environment info:', getEnvironmentInfo());

        const AgoraRTC = (await import('agora-rtc-sdk-ng')).default;

        // Configure Agora for development environment
        try {
          // Some Agora configurations for better compatibility
          if (typeof (AgoraRTC as any).setParameter === 'function') {
            (AgoraRTC as any).setParameter('AUDIO_ENCODER_CONFIG', {
              codec: 'opus',
              'audio.codec': 'opus',
            });
          }
        } catch (configError) {
          console.warn('Agora configuration warning:', configError);
        }

        if (!AgoraRTC.checkSystemRequirements()) {
          setError('Browser not supported for live streaming');
          return;
        }

        const client = AgoraRTC.createClient({ 
          mode: 'live', 
          codec: 'vp8',
          // Add configuration for development environment
          audioCodec: 'opus'
        });
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
        
        // Handle specific Agora errors
        if (err.code === 'UID_CONFLICT') {
          setError('Connection conflict - please try again');
        } else if (err.code === 'INVALID_PARAMS') {
          setError('Invalid stream parameters');
        } else if (err.code === 'NOT_SUPPORTED') {
          setError('Feature not supported in this browser environment');
        } else if (err.code === 'WEB_SECURITY_RESTRICT') {
          setError('Security restriction: Please use HTTPS or localhost');
        } else if (err.code === 'NETWORK_ERROR') {
          setError('Network connection failed');
        } else if (err.code === 'INVALID_TOKEN') {
          setError('Invalid or expired stream token');
        } else {
          setError(`Connection failed: ${err.message || 'Unknown error'}`);
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
