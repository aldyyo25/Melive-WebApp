'use client';

import { useRouter } from 'next/navigation';
import { Broadcaster } from '@/types/streaming';

interface StreamCardProps {
  broadcaster: Broadcaster;
  onJoin?: (broadcaster: Broadcaster) => void;
}

export const StreamCard = ({ broadcaster, onJoin }: StreamCardProps) => {
  const router = useRouter();
  const isLive = broadcaster.status === 'live';

  const handleWatchStream = () => {
    if (onJoin) {
      onJoin(broadcaster);
    } else {
      // Direct navigation using stream ID from API
      router.push(`/watch/${broadcaster.id}`);
    }
  };

  return (
    <div className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-lg border border-white/10 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 overflow-hidden hover:border-purple-500/30 hover:scale-105">
      {/* Preview thumbnail area */}
      <div className="relative h-48 bg-gradient-to-br from-purple-900 to-pink-900 overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 animate-pulse"></div>
        
        {/* Status indicator */}
        <div className="absolute top-4 right-4 z-10">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-md ${
              isLive
                ? 'bg-red-500/90 text-white shadow-lg shadow-red-500/25 animate-pulse'
                : 'bg-gray-600/90 text-gray-300'
            }`}
          >
            {isLive ? '🔴 LIVE' : '⭕ OFFLINE'}
          </div>
        </div>

        {/* Viewer count (if live) */}
        {isLive && (
          <div className="absolute bottom-4 left-4 z-10">
            <div className="px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-xs text-white font-medium">
              👥 {broadcaster.viewers || 0} viewers
            </div>
          </div>
        )}

        {/* Play icon overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
            isLive 
              ? 'bg-white/20 backdrop-blur-md group-hover:bg-white/30 group-hover:scale-110' 
              : 'bg-gray-600/50'
          }`}>
            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ring-2 transition-all ${
                isLive
                  ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600 ring-purple-500/50 group-hover:ring-purple-400'
                  : 'bg-gray-600 ring-gray-500/50'
              }`}
            >
              {broadcaster.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg text-white group-hover:text-fuchsia-400 transition-colors truncate">
                {broadcaster.name}
              </h3>
              <p className="text-sm text-gray-400 truncate">ID: {broadcaster.id}</p>
            </div>
          </div>
        </div>

        {/* Channel info */}
        <div className="mb-6">
          <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-3">
            <p className="text-xs text-gray-400 mb-1 uppercase tracking-wide">Channel</p>
            <p className="font-mono text-sm text-gray-200 break-all">
              {broadcaster.channel}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          {isLive ? (
            <button
              onClick={handleWatchStream}
              className="w-full px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl hover:from-fuchsia-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-fuchsia-500/25 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              Watch Stream
            </button>
          ) : (
            <button
              disabled
              className="w-full px-6 py-3 bg-gray-700/50 text-gray-500 font-semibold rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Unavailable
            </button>
          )}
        </div>
      </div>

      {/* Animated border effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500/0 via-fuchsia-500/20 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};
