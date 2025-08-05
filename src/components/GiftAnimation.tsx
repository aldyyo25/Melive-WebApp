'use client';

import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import { Gift } from '@/types/gift';

interface GiftAnimationProps {
  gift: Gift | null;
  onAnimationEnd: () => void;
}

export const GiftAnimation = ({ gift, onAnimationEnd }: GiftAnimationProps) => {
  const [visible, setVisible] = useState(false);
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gift) {
      setVisible(true);
      setLoading(true);

      // Try to load the Lottie animation
      fetch(gift.lottie_url || gift.animation_file)
        .then((response) => response.json())
        .then((data) => {
          setAnimationData(data);
        })
        .catch((error) => {
          console.warn('Failed to load Lottie animation:', error);
          setAnimationData(null);
        })
        .finally(() => {
          setLoading(false);
        });

      const timer = setTimeout(() => {
        setVisible(false);
        onAnimationEnd();
      }, 4000); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [gift, onAnimationEnd]);

  if (!gift || !visible) return null;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'from-gray-400 to-gray-600';
      case 'rare':
        return 'from-blue-400 to-blue-600';
      case 'epic':
        return 'from-purple-400 to-purple-600';
      case 'legendary':
        return 'from-yellow-400 to-yellow-600';
      default:
        return 'from-gray-400 to-gray-600';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'shadow-gray-500/50';
      case 'rare':
        return 'shadow-blue-500/50';
      case 'epic':
        return 'shadow-purple-500/50';
      case 'legendary':
        return 'shadow-yellow-500/50';
      default:
        return 'shadow-gray-500/50';
    }
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="animate-pulse">
        <div className="text-center">
          {/* Main Animation Container */}
          <div
            className={`relative w-48 h-48 mx-auto mb-4 rounded-full bg-gradient-to-r ${getRarityColor(gift.rarity)} p-2 shadow-2xl ${getRarityGlow(gift.rarity)} animate-bounce`}
          >
            <div className="w-full h-full bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm">
              {loading ? (
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-fuchsia-500"></div>
              ) : animationData ? (
                <Lottie
                  animationData={animationData}
                  loop={true}
                  className="w-32 h-32"
                  style={{ width: 128, height: 128 }}
                />
              ) : (
                <div className="text-8xl animate-bounce">{gift.icon_url}</div>
              )}
            </div>

            {/* Sparkle effects for legendary gifts */}
            {gift.rarity === 'legendary' && (
              <>
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping"></div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping delay-100"></div>
                <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping delay-200"></div>
                <div className="absolute -bottom-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping delay-300"></div>
              </>
            )}
          </div>

          {/* Gift Info */}
          <div
            className={`bg-gradient-to-r ${getRarityColor(gift.rarity)} text-white px-6 py-3 rounded-full shadow-lg animate-pulse`}
          >
            <div className="font-bold text-lg">{gift.name} Gift!</div>
            <div className="text-sm opacity-90">{gift.price_in_diamond} 💎</div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`absolute w-2 h-2 bg-gradient-to-r ${getRarityColor(gift.rarity)} rounded-full animate-ping`}
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 200}ms`,
                  animationDuration: '1.5s',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
