'use client';

import { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@heroui/react';
import Lottie from 'lottie-react';
import { Gift } from '@/types/gift';

interface GiftSuccessPopupProps {
  gift: Gift | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GiftSuccessPopup = ({
  gift,
  isOpen,
  onClose,
}: GiftSuccessPopupProps) => {
  const [animationData, setAnimationData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (gift && isOpen) {
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

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [gift, isOpen, onClose]);

  if (!gift) return null;

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      hideCloseButton
      backdrop="blur"
      classNames={{
        backdrop: 'bg-gradient-to-t from-zinc-900/50 to-zinc-900/50',
        base: 'border-[1px] border-gray-300/50',
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center text-center">
          <div
            className={`bg-gradient-to-r ${getRarityColor(gift.rarity)} bg-clip-text text-transparent text-2xl font-bold`}
          >
            Gift Sent Successfully!
          </div>
        </ModalHeader>
        <ModalBody className="text-center py-6">
          <div className="flex flex-col items-center space-y-4">
            {/* Animation Container */}
            <div
              className={`w-32 h-32 rounded-full bg-gradient-to-r ${getRarityColor(gift.rarity)} p-1 shadow-xl ${getRarityGlow(gift.rarity)}`}
            >
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                {loading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fuchsia-500"></div>
                ) : animationData ? (
                  <Lottie
                    animationData={animationData}
                    loop={true}
                    className="w-24 h-24"
                    style={{ width: 96, height: 96 }}
                  />
                ) : (
                  <div className="text-6xl animate-bounce">{gift.icon_url}</div>
                )}
              </div>
            </div>

            {/* Gift Info */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-gray-800">
                {gift.name}
              </h3>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <span className="text-fuchsia-600 font-medium">
                  {gift.price_in_diamond} 💎
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getRarityColor(gift.rarity)} text-white`}
                >
                  {gift.rarity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center">
              <p className="text-gray-600 text-sm">
                Your gift has been sent to the broadcaster!
              </p>
              <div className="mt-2 flex items-center justify-center space-x-1 text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm font-medium">Delivered</span>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="justify-center">
          <Button
            color="primary"
            onPress={onClose}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
