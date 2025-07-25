'use client';

import { useState, useEffect } from 'react';

interface RatingSystemProps {
  streamId: string;
  compact?: boolean;
}

interface RatingData {
  averageRating: number;
  totalRatings: number;
  userRating: number | null;
  ratingBreakdown: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export const RatingSystem = ({ streamId, compact = false }: RatingSystemProps) => {
  const [ratingData, setRatingData] = useState<RatingData>({
    averageRating: 0,
    totalRatings: 0,
    userRating: null,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize with some sample data
  useEffect(() => {
    // Simulate loading existing ratings
    const totalRatings = Math.floor(Math.random() * 500) + 50;
    const avgRating = Math.random() * 2 + 3; // Between 3-5
    
    // Generate rating breakdown
    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let remainingRatings = totalRatings;
    
    // Bias towards higher ratings
    breakdown[5] = Math.floor(remainingRatings * 0.4);
    breakdown[4] = Math.floor(remainingRatings * 0.3);
    breakdown[3] = Math.floor(remainingRatings * 0.2);
    breakdown[2] = Math.floor(remainingRatings * 0.08);
    breakdown[1] = remainingRatings - breakdown[5] - breakdown[4] - breakdown[3] - breakdown[2];

    setRatingData({
      averageRating: Number(avgRating.toFixed(1)),
      totalRatings,
      userRating: null,
      ratingBreakdown: breakdown
    });

    // Simulate real-time rating updates
    const interval = setInterval(() => {
      if (Math.random() > 0.8) { // 20% chance every interval
        const newRating = Math.floor(Math.random() * 5) + 1;
        setRatingData(prev => {
          const newBreakdown = { ...prev.ratingBreakdown };
          newBreakdown[newRating as keyof typeof newBreakdown]++;
          
          const newTotal = prev.totalRatings + 1;
          const totalScore = 
            newBreakdown[5] * 5 + 
            newBreakdown[4] * 4 + 
            newBreakdown[3] * 3 + 
            newBreakdown[2] * 2 + 
            newBreakdown[1] * 1;
          
          const newAverage = totalScore / newTotal;
          
          return {
            ...prev,
            averageRating: Number(newAverage.toFixed(1)),
            totalRatings: newTotal,
            ratingBreakdown: newBreakdown
          };
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [streamId]);

  const handleRating = async (rating: number) => {
    if (ratingData.userRating === rating) return; // Same rating
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setRatingData(prev => {
      const newBreakdown = { ...prev.ratingBreakdown };
      
      // Remove previous rating if exists
      if (prev.userRating) {
        newBreakdown[prev.userRating as keyof typeof newBreakdown]--;
      } else {
        // New rating, increment total
        prev.totalRatings++;
      }
      
      // Add new rating
      newBreakdown[rating as keyof typeof newBreakdown]++;
      
      // Calculate new average
      const totalScore = 
        newBreakdown[5] * 5 + 
        newBreakdown[4] * 4 + 
        newBreakdown[3] * 3 + 
        newBreakdown[2] * 2 + 
        newBreakdown[1] * 1;
      
      const newAverage = totalScore / prev.totalRatings;
      
      return {
        ...prev,
        averageRating: Number(newAverage.toFixed(1)),
        userRating: rating,
        ratingBreakdown: newBreakdown
      };
    });
    
    setIsSubmitting(false);
  };

  const StarIcon = ({ filled, half = false }: { filled: boolean; half?: boolean }) => (
    <svg 
      className={`w-5 h-5 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} 
      fill="currentColor" 
      viewBox="0 0 24 24"
    >
      {half ? (
        <defs>
          <linearGradient id="half-fill">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="#d1d5db" />
          </linearGradient>
        </defs>
      ) : null}
      <path 
        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
        fill={half ? 'url(#half-fill)' : 'currentColor'}
      />
    </svg>
  );

  const renderStars = (rating: number, interactive = false) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      const isFilled = i <= fullStars;
      const isHalf = i === fullStars + 1 && hasHalfStar;
      const isHovered = interactive && hoveredRating !== null && i <= hoveredRating;
      const isUserRated = interactive && ratingData.userRating !== null && i <= ratingData.userRating;
      
      stars.push(
        <button
          key={i}
          onClick={() => interactive && handleRating(i)}
          onMouseEnter={() => interactive && setHoveredRating(i)}
          onMouseLeave={() => interactive && setHoveredRating(null)}
          disabled={!interactive || isSubmitting}
          className={`transition-all duration-200 ${
            interactive ? 'hover:scale-110 cursor-pointer' : 'cursor-default'
          } ${isSubmitting ? 'opacity-50' : ''}`}
        >
          <StarIcon 
            filled={isFilled || isHalf || isHovered || isUserRated} 
            half={isHalf && !isHovered && !isUserRated}
          />
        </button>
      );
    }
    
    return stars;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-black/50 text-white px-3 py-2 rounded-lg">
        <div className="flex items-center gap-1">
          {renderStars(ratingData.averageRating)}
        </div>
        <span className="text-sm font-medium">
          {ratingData.averageRating} ({formatNumber(ratingData.totalRatings)})
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-6 text-white">
      <h3 className="font-semibold mb-4">Rate this Stream</h3>
      
      {/* Current Rating Display */}
      <div className="flex items-center gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400 mb-1">
            {ratingData.averageRating}
          </div>
          <div className="flex items-center gap-1 justify-center mb-1">
            {renderStars(ratingData.averageRating)}
          </div>
          <div className="text-sm text-gray-400">
            {formatNumber(ratingData.totalRatings)} ratings
          </div>
        </div>
        
        {/* Rating Breakdown */}
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map(star => {
            const count = ratingData.ratingBreakdown[star as keyof typeof ratingData.ratingBreakdown];
            const percentage = ratingData.totalRatings > 0 ? (count / ratingData.totalRatings) * 100 : 0;
            
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="w-3 text-center">{star}</span>
                <StarIcon filled={true} />
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-gray-400">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* User Rating Input */}
      <div className="border-t border-gray-700 pt-4">
        <div className="mb-3">
          <span className="text-sm text-gray-300">Your Rating:</span>
        </div>
        
        <div className="flex items-center gap-2 mb-4">
          {renderStars(hoveredRating || ratingData.userRating || 0, true)}
        </div>
        
        {ratingData.userRating && (
          <div className="text-sm text-green-400 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Thank you for rating!
          </div>
        )}
        
        {isSubmitting && (
          <div className="text-sm text-gray-400 flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-fuchsia-500"></div>
            Submitting...
          </div>
        )}
      </div>
    </div>
  );
};
