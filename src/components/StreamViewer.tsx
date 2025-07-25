'use client';

import { useState } from 'react';
import { AgoraVideoPlayerWrapper } from './AgoraVideoPlayerWrapper';
import { StreamCard } from './StreamCard';
import { LiveChat } from './LiveChat';
import { GiftPanel } from './GiftPanel';
import { GiftAnimation } from './GiftAnimation';
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
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full animate-spin mx-auto mb-6">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-fuchsia-500 rounded-full animate-spin"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Finding Live Streams</h3>
          <p className="text-gray-400">Discovering amazing content for you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md mx-auto">
          <div className="bg-gradient-to-br from-red-900/50 to-gray-900/50 backdrop-blur-lg border border-red-500/20 rounded-2xl p-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Connection Error</h3>
            <p className="text-red-400 mb-2 font-medium">Failed to Load Streams</p>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              🔄 Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {currentStream ? (
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 flex justify-between items-center bg-gradient-to-r from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-fuchsia-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  Live Stream
                </h2>
                <p className="text-sm text-gray-300 font-mono">
                  Channel: {currentStream.channel}
                </p>
              </div>
            </div>
            <button
              onClick={handleLeaveStream}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-red-500/25 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
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
                <div className="max-w-[1000px] mx-auto relative">
                  <div className="aspect-[4/3] bg-black rounded-lg overflow-hidden shadow-lg relative">
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
                        onGiftSent={(gift) => setCurrentGift(gift)}
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
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-fuchsia-200 to-pink-200 bg-clip-text text-transparent mb-4 tracking-tight">
              Available Streams
            </h1>
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3 mb-6">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-white font-medium">Live Now</span>
            </div>
          </div>

          {!Array.isArray(broadcasters) || broadcasters.length === 0 ? (
            <div className="text-center">
              <div className="max-w-md mx-auto bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-lg border border-white/10 rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">No Live Streams</h3>
                <p className="text-gray-400 mb-6">There are no active streams at the moment. Check back soon!</p>
                <button
                  onClick={handleRetry}
                  className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  🔄 Refresh Streams
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-7xl mx-auto">
              {/* Stats header */}
              <div className="mb-12 text-center">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 backdrop-blur-lg border border-white/20 rounded-full px-6 py-3">
                  <div className="flex -space-x-1">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                    <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse animation-delay-75"></div>
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse animation-delay-150"></div>
                  </div>
                  <span className="text-white font-semibold text-lg">
                    {broadcasters.length} Active Stream{broadcasters.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
              
              {/* Modern grid layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {broadcasters.map((broadcaster, index) => (
                  <StreamCard
                    key={broadcaster.id || `broadcaster-${index}`}
                    broadcaster={broadcaster}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
