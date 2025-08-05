'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useStreaming } from '@/hooks/useStreaming';
import { StreamDetails } from '@/types/streaming';
import { LiveChat } from '@/components/LiveChat';
import { GiftAnimation } from '@/components/GiftAnimation';
import { Gift } from '@/types/gift';
import { GiftPanel } from '@/components/GiftPanel';
import { AGORA_CONFIG } from '@/config/agora'; // Make sure this path is correct
import { EnhancedAgoraPlayer } from '@/components/EnhancedAgoraPlayer'; // Make sure this path is correct
import SimpleErrorBoundary from '@/components/SimpleErrorBoundary'; // Make sure this path is correct

function WatchStreamPage() {
  // 1. ALL HOOKS FIRST - NEVER CONDITIONAL
  const params = useParams();
  const router = useRouter();
  const { getStreamDetails } = useStreaming();

  // 2. MEMOIZED VALUES
  const streamId = useMemo(
    () => params?.streamId as string,
    [params?.streamId]
  );

  // 3. STATE HOOKS
  const [streamDetails, setStreamDetails] = useState<StreamDetails | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);

  // 4. MEMOIZED COMPUTED VALUES
  const isValidStream = useMemo(() => {
    return (
      streamDetails &&
      streamDetails.agora_token &&
      streamDetails.channel &&
      streamDetails.app_id
    );
  }, [streamDetails]);

  const playerProps = useMemo(
    () => ({
      appId: AGORA_CONFIG.APP_ID,
      channel: streamDetails?.channel || '',
      token: streamDetails?.agora_token || '',
      uid: streamDetails?.uid || 0,
      streamId: streamId,
    }),
    [streamDetails, streamId]
  );

  // 5. CALLBACKS
  const loadStream = useCallback(
    async (currentRetryCount = 0) => {
      if (!streamId || typeof streamId !== 'string') {
        setError('Invalid stream ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log('Loading stream details for:', streamId);
        const details = await getStreamDetails(streamId);

        if (details && details.agora_token) {
          console.log('Stream details loaded successfully:', details);
          setStreamDetails(details);
          setError(null);
          setRetryCount(0);
          setInitialLoad(false);
        } else {
          setError('Stream not found or missing authentication token');
        }
      } catch (err) {
        console.error('Failed to load stream:', err);
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load stream details';
        setError(errorMessage);

        if (
          currentRetryCount < 3 &&
          (errorMessage.includes('network') || errorMessage.includes('timeout'))
        ) {
          setRetryCount(currentRetryCount + 1);
          setTimeout(
            () => {
              loadStream(currentRetryCount + 1);
            },
            2000 * (currentRetryCount + 1)
          );
        }
      } finally {
        setLoading(false);
        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    },
    [streamId, getStreamDetails, initialLoad]
  );

  const handleGoBack = useCallback(() => {
    router.push('/');
  }, [router]);

  const handleRetry = useCallback(() => {
    setRetryCount(0);
    setError(null);
    setStreamDetails(null);
    setInitialLoad(true);
    setLoading(true);
    loadStream(0);
  }, [loadStream]);

  // 6. EFFECTS - MUST BE CALLED CONSISTENTLY
  useEffect(() => {
    let isMounted = true;

    if (isMounted && streamId) {
      loadStream(0);
    }

    return () => {
      isMounted = false;
    };
  }, [streamId, loadStream]); // Include loadStream for better dependency tracking

  // 7. CONDITIONAL RENDERING (AFTER ALL HOOKS)
  if (loading && initialLoad) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500 mx-auto mb-4"></div>
          <p className="text-lg mb-2">Loading stream...</p>
          {retryCount > 0 && (
            <p className="text-sm text-gray-400">
              Attempt {retryCount + 1} of 4
            </p>
          )}
          <p className="text-sm text-gray-400 mt-4">
            Please wait while we connect to the stream
          </p>
        </div>
      </div>
    );
  }

  if (error || !streamDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-red-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">Stream Unavailable</h1>
          <p className="text-gray-300 mb-6">{error}</p>

          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-left">
            <p className="text-sm text-gray-400 mb-2">Debug Info:</p>
            <p className="text-xs text-gray-500">Stream ID: {streamId}</p>
            <p className="text-xs text-gray-500">Retry Count: {retryCount}</p>
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidStream) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white max-w-md mx-auto px-4">
          <div className="mb-6">
            <svg
              className="w-20 h-20 mx-auto text-yellow-500 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-4">
            Stream Configuration Error
          </h1>
          <p className="text-gray-300 mb-6">
            The stream is missing required authentication or configuration data.
          </p>

          <div className="mb-6 p-4 bg-gray-800/50 rounded-lg text-left">
            <p className="text-sm text-gray-400 mb-2">Missing:</p>
            {!streamDetails?.agora_token && (
              <p className="text-xs text-red-400">• Agora Token</p>
            )}
            {!streamDetails?.channel && (
              <p className="text-xs text-red-400">• Channel Name</p>
            )}
            {!streamDetails?.app_id && (
              <p className="text-xs text-red-400">• App ID</p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
            >
              🔄 Reload Stream
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <SimpleErrorBoundary>
      <div className="h-screen bg-black flex">
        {/* Gift Panel - Left Side */}
        <div className="w-16 bg-gray-900 flex flex-col border-r border-gray-700">
          {/* Gift Panel Header */}
          <div className="p-2 border-b border-gray-700">
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Gift Panel Component */}
          <div className="flex-1 flex items-center justify-center p-2">
            <GiftPanel
              streamId={streamDetails.stream_id}
              onGiftSent={(gift) => setCurrentGift(gift)}
            />
          </div>
        </div>

        {/* Main Video Area with Gifts */}
        <div className="flex-1 relative">
          <EnhancedAgoraPlayer {...playerProps} className="w-full h-full" />

          {/* Gift Animation Layer */}
          <GiftAnimation
            gift={currentGift}
            onAnimationEnd={() => setCurrentGift(null)}
          />

          {/* Stream Info & Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20">
            <div className="flex items-start justify-between">
              <div className="text-white">
                <h1 className="text-lg font-semibold mb-1">Live Stream</h1>
                <p className="text-sm text-gray-300">
                  Channel: {streamDetails.channel}
                </p>
              </div>
              <button
                onClick={handleGoBack}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                Leave Stream
              </button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 bg-red-900/90 border border-red-500/50 text-red-200 p-3 rounded">
                <p className="text-sm">Error: {error}</p>
              </div>
            )}
          </div>

          {/* Stream Stats Overlay */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="bg-black/70 backdrop-blur-md text-white px-4 py-2 rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <div className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span>Live viewers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Panel */}
        <div className="w-80 bg-gray-900 flex flex-col border-l border-gray-700">
          {/* Chat Header with Online Count */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-semibold">Live Chat</h3>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-xs">Online</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">Active viewers</div>
          </div>

          {/* Live Chat Component */}
          <div className="flex-1 flex flex-col">
            <LiveChat
              streamId={streamDetails.stream_id}
              channelCode={streamDetails.channel}
              className="flex-1"
            />
          </div>
        </div>
      </div>
    </SimpleErrorBoundary>
  );
}

export default WatchStreamPage;
