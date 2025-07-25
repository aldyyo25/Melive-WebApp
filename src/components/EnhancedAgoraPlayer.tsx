'use client';

import { useEffect, useRef, useState, memo } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IAgoraRTCClient = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IAgoraRTCRemoteUser = any;

interface EnhancedAgoraPlayerProps {
  appId: string;
  channel: string;
  token: string;
  uid?: number;
  className?: string;
  streamId: string;
}

export const EnhancedAgoraPlayer = memo(({
  appId,
  channel,
  token,
  uid = 0,
  className = '',
  streamId,
}: EnhancedAgoraPlayerProps) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('disconnected');
  const [hasVideo, setHasVideo] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  // Enhanced WebRTC support detection
  const checkWebRTCSupport = () => {
    if (typeof window === 'undefined') return false;
    
    try {
      // Check for basic WebRTC support
      const hasWebRTC = !!(
        window.RTCPeerConnection ||
        (window as any).webkitRTCPeerConnection ||
        (window as any).mozRTCPeerConnection
      );

      // For viewers, we don't need getUserMedia, only receiving capability
      const hasMediaDevices = !!(navigator.mediaDevices);
      
      // Test if we can create a basic RTCPeerConnection
      let canCreateConnection = false;
      try {
        const testConnection = new RTCPeerConnection();
        canCreateConnection = true;
        testConnection.close();
      } catch (e) {
        console.warn('Cannot create RTCPeerConnection:', e);
      }

      const isSupported = hasWebRTC && hasMediaDevices && canCreateConnection;
      
      console.log('WebRTC Support Check:', {
        hasWebRTC,
        hasMediaDevices,
        canCreateConnection,
        isSupported,
        userAgent: navigator.userAgent
      });

      return isSupported;
    } catch (error) {
      console.error('WebRTC support check failed:', error);
      return false;
    }
  };

  useEffect(() => {
    let isComponentMounted = true;
    
    const initAgora = async () => {
      try {
        // Validate required props
        if (!appId || !channel) {
          setError('Missing required stream configuration (App ID or Channel)');
          return;
        }

        if (!token) {
          setError('Authentication token is required but not provided');
          return;
        }

        const { default: AgoraRTC } = await import('agora-rtc-sdk-ng');
        
        // Check WebRTC support with Agora's method
        if (!AgoraRTC.checkSystemRequirements()) {
          console.error('Agora system requirements not met');
          setError('Your browser does not support video streaming. Please use a modern browser like Chrome, Firefox, Safari, or Edge.');
          return;
        }

        // Additional WebRTC support check
        if (!checkWebRTCSupport()) {
          console.error('WebRTC support check failed');
          setError('WebRTC features are not available. Please ensure you are using HTTPS and a supported browser.');
          return;
        }

        // Create client optimized for viewers
        const client = AgoraRTC.createClient({ 
          mode: 'live',     // Live streaming mode
          codec: 'vp8',     // VP8 for better compatibility
          role: 'audience'  // Set as audience (viewer)
        });
        
        // Configure Agora for viewer mode to prevent security errors
        AgoraRTC.setLogLevel(1); // Reduce logging to prevent console spam
        
        clientRef.current = client;

        // Set client role to audience
        await client.setClientRole('audience');

        // Enhanced connection quality monitoring
        client.on('network-quality', (stats) => {
          const quality = stats.downlinkNetworkQuality;
          switch (quality) {
            case 1:
            case 2:
              setConnectionQuality('excellent');
              break;
            case 3:
            case 4:
              setConnectionQuality('good');
              break;
            case 5:
            case 6:
              setConnectionQuality('poor');
              break;
            default:
              setConnectionQuality('disconnected');
          }
        });

        // Handle remote user events with error recovery
        client.on(
          'user-published',
          async (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
            try {
              await client.subscribe(user, mediaType);
              
              setRemoteUsers(prev => {
                const exists = prev.find(u => u.uid === user.uid);
                if (!exists) {
                  return [...prev, user];
                }
                return prev;
              });

              if (mediaType === 'video' && videoRef.current) {
                setHasVideo(true);
                user.videoTrack?.play(videoRef.current);
              }
            } catch (subscribeError) {
              console.error('Subscribe error:', subscribeError);
              // Retry subscription after delay
              setTimeout(async () => {
                try {
                  await client.subscribe(user, mediaType);
                  if (mediaType === 'video' && videoRef.current) {
                    user.videoTrack?.play(videoRef.current);
                  }
                } catch (retryError) {
                  console.error('Retry subscribe failed:', retryError);
                }
              }, 2000);
            }
          }
        );

        client.on('user-unpublished', (user: IAgoraRTCRemoteUser, mediaType: 'video' | 'audio') => {
          if (mediaType === 'video') {
            if (user.videoTrack) {
              user.videoTrack.stop();
            }
            setHasVideo(false);
          }
          
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
        });

        client.on('user-left', (user: IAgoraRTCRemoteUser) => {
          setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid));
          if (remoteUsers.length <= 1) {
            setHasVideo(false);
          }
        });

        client.on('connection-state-change', (curState: string, revState: string) => {
          console.log('Connection state changed:', curState, revState);
          
          if (curState === 'CONNECTED') {
            setIsConnected(true);
            setError(null);
          } else if (curState === 'DISCONNECTED') {
            setIsConnected(false);
            setConnectionQuality('disconnected');
          } else if (curState === 'RECONNECTING') {
            setConnectionQuality('poor');
          }
        });

        // Enhanced error handling for join
        try {
          console.log('Attempting to join Agora channel:', { appId, channel, uid });
          await client.join(appId, channel, token, uid);
          
          if (isComponentMounted) {
            setIsConnected(true);
            setError(null);
          }
        } catch (joinError: any) {
          console.error('Join error:', joinError);
          
          let errorMessage = 'Failed to connect to stream';
          
          console.error('Agora join error details:', {
            code: joinError.code,
            message: joinError.message,
            stack: joinError.stack
          });
          
          switch (joinError.code) {
            case 'INVALID_PARAMS':
              errorMessage = 'Invalid stream configuration. Please check stream parameters.';
              break;
            case 'NOT_SUPPORTED':
              errorMessage = 'WebRTC not supported. Please use Chrome 58+, Firefox 56+, Safari 12+, or Edge 79+.';
              break;
            case 'WEB_SECURITY_RESTRICT':
              errorMessage = 'Security restriction: Please use HTTPS (https://) or localhost to access this stream.';
              break;
            case 'NETWORK_ERROR':
              errorMessage = 'Network connection failed. Please check your internet connection and try again.';
              break;
            case 'INVALID_TOKEN':
              errorMessage = 'Stream authentication failed. The stream may be offline or access token expired.';
              break;
            case 'UID_CONFLICT':
              errorMessage = 'Connection conflict detected. Please refresh the page.';
              break;
            case 'OPERATION_ABORTED':
              errorMessage = 'Connection attempt was cancelled. Please try again.';
              break;
            default:
              if (joinError.message) {
                errorMessage = `Connection failed: ${joinError.message}`;
              }
          }
          
          if (isComponentMounted) {
            setError(errorMessage);
          }
        }

      } catch (err: unknown) {
        console.error('Failed to initialize Agora:', err);
        const error = err as any;
        
        let errorMessage = 'Failed to initialize video player';
        
        if (error.message?.includes('not supported') || error.message?.includes('enumerateDevices')) {
          errorMessage = 'Browser compatibility issue. For best experience, please use HTTPS or localhost.';
        } else if (error.message?.includes('network')) {
          errorMessage = 'Network error. Please check your connection.';
        } else if (error.message?.includes('security') || error.message?.includes('WEB_SECURITY_RESTRICT')) {
          errorMessage = 'Security restriction: Please access this page via HTTPS or localhost.';
        }
        
        if (isComponentMounted) {
          setError(errorMessage);
        }
      }
    };

    if (typeof window !== 'undefined' && appId && channel && token) {
      initAgora();
    }

    return () => {
      isComponentMounted = false;
      
      if (clientRef.current) {
        try {
          clientRef.current.leave();
        } catch (err) {
          console.error('Error leaving channel:', err);
        }
        clientRef.current = null;
      }
      setIsConnected(false);
      setHasVideo(false);
      setRemoteUsers([]);
    };
  }, [appId, channel, token, uid]); // Removed streamId to prevent unnecessary re-initialization

  // Connection quality indicator
  const getQualityColor = () => {
    switch (connectionQuality) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getQualityIcon = () => {
    switch (connectionQuality) {
      case 'excellent': return '●●●';
      case 'good': return '●●○';
      case 'poor': return '●○○';
      default: return '○○○';
    }
  };

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white ${className}`}>
        <div className="text-center p-8">
          <div className="mb-4">
            <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Stream Error</h3>
          <p className="text-gray-300 text-sm">{error}</p>
          
          {/* Browser compatibility tips */}
          {error.includes('WebRTC') && (
            <div className="mt-4 p-4 bg-gray-800 rounded-lg text-left">
              <h4 className="font-semibold mb-2">Supported Browsers:</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Chrome 58+</li>
                <li>• Firefox 56+</li>
                <li>• Safari 12+</li>
                <li>• Edge 79+</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black ${className}`}>
      {/* Video container */}
      <div ref={videoRef} className="w-full h-full" />
      
      {/* Loading overlay */}
      {!isConnected && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
            <p>Connecting to stream...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a few moments</p>
          </div>
        </div>
      )}

      {/* No video overlay */}
      {isConnected && !hasVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black text-white">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p>Waiting for video stream...</p>
            <p className="text-sm text-gray-400 mt-2">The broadcaster will appear here shortly</p>
          </div>
        </div>
      )}

      {/* Connection quality indicator */}
      {isConnected && (
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span className={getQualityColor()}>{getQualityIcon()}</span>
            <span className="capitalize">{connectionQuality}</span>
          </div>
        </div>
      )}

      {/* Remote users count */}
      {isConnected && remoteUsers.length > 0 && (
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <span>👥 {remoteUsers.length} active</span>
          </div>
        </div>
      )}
    </div>
  );
});

EnhancedAgoraPlayer.displayName = 'EnhancedAgoraPlayer';
