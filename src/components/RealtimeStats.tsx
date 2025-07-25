'use client';

import { useState, useEffect } from 'react';

interface RealtimeStatsProps {
  streamId: string;
  compact?: boolean;
}

interface StreamStats {
  viewCount: number;
  likesCount: number;
  duration: string;
  quality: 'HD' | 'FHD' | '4K' | 'SD';
}

export const RealtimeStats = ({ streamId, compact = false }: RealtimeStatsProps) => {
  const [stats, setStats] = useState<StreamStats>({
    viewCount: 0,
    likesCount: 0,
    duration: '00:00',
    quality: 'HD'
  });

  const [isLive, setIsLive] = useState(true);

  // Simulate realtime updates
  useEffect(() => {
    // Initialize with random base values
    const baseViews = Math.floor(Math.random() * 1000) + 50;
    const baseLikes = Math.floor(Math.random() * 200) + 10;
    
    setStats(prev => ({
      ...prev,
      viewCount: baseViews,
      likesCount: baseLikes
    }));

    // Update view count every 3-5 seconds
    const viewInterval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        viewCount: prev.viewCount + Math.floor(Math.random() * 5) + 1
      }));
    }, Math.random() * 2000 + 3000);

    // Update likes occasionally
    const likeInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance
        setStats(prev => ({
          ...prev,
          likesCount: prev.likesCount + Math.floor(Math.random() * 3) + 1
        }));
      }
    }, Math.random() * 5000 + 2000);

    // Update duration every second
    let seconds = 0;
    const durationInterval = setInterval(() => {
      seconds++;
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      setStats(prev => ({
        ...prev,
        duration: `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      }));
    }, 1000);

    // Simulate connection quality changes
    const qualityInterval = setInterval(() => {
      const qualities: StreamStats['quality'][] = ['HD', 'FHD', '4K', 'SD'];
      const weights = [0.4, 0.3, 0.2, 0.1]; // Prefer HD
      const random = Math.random();
      let weightSum = 0;
      
      for (let i = 0; i < qualities.length; i++) {
        weightSum += weights[i];
        if (random <= weightSum) {
          setStats(prev => ({ ...prev, quality: qualities[i] }));
          break;
        }
      }
    }, 15000);

    return () => {
      clearInterval(viewInterval);
      clearInterval(likeInterval);
      clearInterval(durationInterval);
      clearInterval(qualityInterval);
    };
  }, [streamId]);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getQualityColor = (quality: StreamStats['quality']) => {
    switch (quality) {
      case '4K': return 'text-purple-400';
      case 'FHD': return 'text-blue-400';
      case 'HD': return 'text-green-400';
      case 'SD': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-black/50 text-white px-3 py-2 rounded-lg text-sm">
        <div className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
          <span>{isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
        
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
          </svg>
          <span>{formatNumber(stats.viewCount)}</span>
        </div>

        <div className={`text-xs font-semibold ${getQualityColor(stats.quality)}`}>
          {stats.quality}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Stream Stats</h3>
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></span>
          <span className="text-sm font-medium">{isLive ? 'LIVE' : 'OFFLINE'}</span>
        </div>
      </div>

      <div className="space-y-3">
        {/* View Count */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
            </svg>
            <span className="text-sm">Viewers</span>
          </div>
          <span className="font-bold text-lg">{formatNumber(stats.viewCount)}</span>
        </div>

        {/* Likes */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span className="text-sm">Likes</span>
          </div>
          <span className="font-bold text-lg">{formatNumber(stats.likesCount)}</span>
        </div>

        {/* Duration */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
              <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
            </svg>
            <span className="text-sm">Duration</span>
          </div>
          <span className="font-bold text-lg">{stats.duration}</span>
        </div>

        {/* Quality */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            <span className="text-sm">Quality</span>
          </div>
          <span className={`font-bold text-lg ${getQualityColor(stats.quality)}`}>
            {stats.quality}
          </span>
        </div>
      </div>

      {/* Real-time indicator */}
      <div className="mt-4 pt-3 border-t border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Real-time updates</span>
        </div>
      </div>
    </div>
  );
};
