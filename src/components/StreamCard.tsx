'use client';

import { Broadcaster } from '@/types/streaming';

interface StreamCardProps {
  broadcaster: Broadcaster;
  onJoin: (broadcaster: Broadcaster) => void;
}

export const StreamCard = ({ broadcaster, onJoin }: StreamCardProps) => {
  const isLive = broadcaster.status === 'live';

  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
      {/* Status indicator */}
      <div className="absolute top-4 right-4 z-10">
        <div
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            isLive
              ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {isLive ? '🔴 LIVE' : 'OFFLINE'}
        </div>
      </div>

      {/* Card content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-2">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                isLive
                  ? 'bg-gradient-to-br from-fuchsia-500 to-pink-600'
                  : 'bg-gray-400'
              }`}
            >
              {broadcaster.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-fuchsia-600 transition-colors">
                {broadcaster.name}
              </h3>
              <p className="text-sm text-gray-500">ID: {broadcaster.id}</p>
            </div>
          </div>
        </div>

        {/* Channel info */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-sm text-gray-600 mb-1">Channel</p>
            <p className="font-mono text-sm text-gray-900 break-all">
              {broadcaster.channel}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-end">
          {isLive ? (
            <button
              onClick={() => onJoin(broadcaster)}
              className="px-6 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white font-semibold rounded-xl hover:from-fuchsia-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Join Stream
            </button>
          ) : (
            <button
              disabled
              className="px-6 py-3 bg-gray-100 text-gray-400 font-semibold rounded-xl cursor-not-allowed"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
};
