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
      <div className="animate-fadeIn">
        <div className="text-center">
          <video 
            autoPlay 
            muted 
            className="w-40 h-40 mx-auto"
            onEnded={onAnimationEnd}
            onError={onAnimationEnd}
          >
            <source src={gift.animation_file} type="video/mp4" />
          </video>
          <div className="bg-black/50 text-white px-4 py-2 rounded-full mt-2 animate-bounce">
            {gift.name} Gift!
          </div>
        </div>
      </div>
    </div>
  );
};