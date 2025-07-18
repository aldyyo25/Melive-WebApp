'use client';

import { useState, useEffect } from 'react';
import { Gift } from '@/types/gift';

interface GiftAnimationProps {
  gift: Gift | null;
  onAnimationEnd: () => void;
}

export const GiftAnimation = ({ gift, onAnimationEnd }: GiftAnimationProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (gift) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onAnimationEnd();
      }, 3000); // Animation duration

      return () => clearTimeout(timer);
    }
  }, [gift, onAnimationEnd]);

  if (!gift || !visible) return null;

  return (
    <div className="absolute inset-0 z-50 pointer-events-none flex items-center justify-center">
      <div className="animate-fadeIn animate-floatUp">
        <div className="text-center">
          {gift.animation_file ? (
            <video
              autoPlay
              muted
              className="w-40 h-40 mx-auto"
              onEnded={onAnimationEnd}
              onError={() => {
                console.warn(
                  `Failed to load gift animation: ${gift.animation_file}`
                );
                onAnimationEnd();
              }}
            >
              <source src={gift.animation_file} type="video/mp4" />
              <source src="/sample-video.mp4" type="video/mp4" />{' '}
              {/* Fallback */}
            </video>
          ) : (
            <div className="w-40 h-40 mx-auto flex items-center justify-center">
              <img
                src={gift.icon_url || '/default-image.jpg'}
                alt={gift.name}
                className="w-24 h-24 animate-bounce"
              />
            </div>
          )}
          <div className="bg-black/50 text-white px-4 py-2 rounded-full mt-2 animate-bounce">
            {gift.name} Gift!
          </div>
        </div>
      </div>
    </div>
  );
};
