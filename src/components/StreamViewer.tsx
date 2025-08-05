'use client';

import { useState } from 'react';
import { AgoraVideoPlayerWrapper } from './AgoraVideoPlayerWrapper';
import { StreamCard } from './StreamCard';
import { LiveChat } from './LiveChat';
import { GiftPanel } from './GiftPanel';
import { GiftAnimation } from './GiftAnimation';
import { GiftSuccessPopup } from './GiftSuccessPopup';
import { useStreaming } from '@/hooks/useStreaming';
import { Broadcaster, StreamDetails } from '@/types/streaming';
import { Gift } from '@/types/gift';

export const StreamViewer = () => {
  const { broadcasters, loading, error, retry, clearError, getStreamDetails } =
    useStreaming();
  const [currentStream, setCurrentStream] = useState<StreamDetails | null>(
    null
  );
  const [streamLoading, setStreamLoading] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const [currentGift, setCurrentGift] = useState<Gift | null>(null);
  const [successGift, setSuccessGift] = useState<Gift | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleJoinStream = async (broadcaster: Broadcaster) => {
    // Clear any existing stream first
    if (currentStream) {
      setCurrentStream(null);
      await new Promise((resolve) => setTimeout(resolve, 500)); // Brief delay for cleanup
    }

    setStreamLoading(true);
    setStreamError(null);

    try {
      const streamDetails = await getStreamDetails(broadcaster.id);

      if (streamDetails) {
        setCurrentStream(streamDetails);
      } else {
        setStreamError('Failed to get stream details');
      }
    } catch (err) {
      console.error('Failed to join stream:', err);
      setStreamError('Failed to join stream');
    } finally {
      setStreamLoading(false);
    }
  };

  const handleLeaveStream = () => {
    setCurrentStream(null);
    setStreamError(null);
  };

  const handleRetry = () => {
    clearError();
    retry();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading broadcasters...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <p className="text-lg font-semibold mb-2">
              Error Loading Broadcasters
            </p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={handleRetry}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentStream ? (
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Live Stream</h2>
              <p className="text-sm text-gray-600">
                Channel: {currentStream.channel}
              </p>
            </div>
            <button
              onClick={handleLeaveStream}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Leave Stream
            </button>
          </div>

          {streamLoading ? (
            <div className="aspect-video bg-gray-900 flex items-center justify-center text-white rounded-lg">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Connecting to stream...</p>
              </div>
            </div>
          ) : streamError ? (
            <div className="aspect-video bg-red-900 flex items-center justify-center text-white rounded-lg">
              <div className="text-center">
                <p className="mb-4">Error: {streamError}</p>
                <button
                  onClick={handleLeaveStream}
                  className="bg-white text-red-900 px-4 py-2 rounded"
                >
                  Go Back
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-4 h-full">
              <div className="flex-1 lg:flex-[2] relative">
                {/* Portrait Video Container */}
                <div className="max-w-[400px] mx-auto relative">
                  <div className="portrait-video bg-black relative">
                    <AgoraVideoPlayerWrapper
                      appId={currentStream.app_id}
                      channel={currentStream.channel}
                      token={currentStream.agora_token ?? ''}
                      uid={currentStream.uid}
                      className="h-full w-full"
                    />

                    {/* Gift Animation Layer */}
                    <GiftAnimation
                      gift={currentGift}
                      onAnimationEnd={() => setCurrentGift(null)}
                    />

                    {/* Gift Button */}
                    <div className="absolute bottom-4 right-4 z-10">
                      <GiftPanel
                        streamId={currentStream.stream_id}
                        onGiftSent={(gift) => {
                          setCurrentGift(gift);
                          setSuccessGift(gift);
                          setShowSuccessPopup(true);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full lg:w-80 lg:flex-shrink-0">
                <LiveChat
                  streamId={currentStream.stream_id}
                  channelCode={currentStream.channel}
                  className="h-96 lg:h-[600px]"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Live Streams
            </h1>
            <p className="text-gray-600">
              Discover and join live streaming sessions
            </p>
          </div>

          {!Array.isArray(broadcasters) || broadcasters.length === 0 ? (
            <div className="text-center text-gray-500">
              <p className="mb-4">No streams available at the moment.</p>
              <button
                onClick={handleRetry}
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-full font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                  {broadcasters.length} Streams Available
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {broadcasters.map((broadcaster, index) => (
                  <StreamCard
                    key={broadcaster.id || `broadcaster-${index}`}
                    broadcaster={broadcaster}
                    onJoin={handleJoinStream}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Gift Success Popup */}
      <GiftSuccessPopup
        gift={successGift}
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          setSuccessGift(null);
        }}
      />
    </div>
  );
};
