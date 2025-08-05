'use client';

import { useState, useEffect } from 'react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/react';
import { Gift } from '@/types/gift';
import { giftService } from '@/services/giftService';

interface GiftPanelProps {
  streamId: string;
  onGiftSent: (gift: Gift) => void;
}

export const GiftPanel = ({ streamId, onGiftSent }: GiftPanelProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        setLoading(true);
        setError(null);
        const giftData = await giftService.getGifts();
        setGifts(giftData);
      } catch (err) {
        setError('Failed to load gifts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchGifts();
    }
  }, [isOpen]);

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => {
    setIsOpen(false);
    setSelectedGift(null);
  };

  const handleSelectGift = (gift: Gift) => {
    setSelectedGift(gift);
  };

  const handleSendGift = async () => {
    if (!selectedGift) return;

    try {
      setSending(true);
      const success = await giftService.sendGift(streamId, selectedGift.id);

      if (success) {
        onGiftSent(selectedGift);
        handleClose();
      } else {
        setError('Failed to send gift');
      }
    } catch (err) {
      setError('Error sending gift');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-full p-3"
        isIconOnly
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 12v10H4V12"></path>
          <path d="M2 7h20v5H2z"></path>
          <path d="M12 22V7"></path>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
        </svg>
      </Button>

      <Modal isOpen={isOpen} onClose={handleClose}>
        <ModalContent>
          <ModalHeader className="text-center">Send a Gift</ModalHeader>
          <ModalBody>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fuchsia-500"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 py-4">{error}</div>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {gifts.map((gift) => (
                  <div
                    key={gift.id}
                    onClick={() => handleSelectGift(gift)}
                    className={`p-3 border rounded-lg text-center cursor-pointer transition-all relative ${
                      selectedGift?.id === gift.id
                        ? 'border-fuchsia-500 bg-fuchsia-50'
                        : 'border-gray-200 hover:border-fuchsia-300'
                    } ${
                      gift.rarity === 'legendary'
                        ? 'shadow-lg shadow-yellow-500/20 hover:shadow-yellow-500/40'
                        : gift.rarity === 'epic'
                          ? 'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40'
                          : gift.rarity === 'rare'
                            ? 'shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40'
                            : 'hover:shadow-md'
                    }`}
                  >
                    <div className="w-12 h-12 mx-auto mb-2 relative">
                      <div className="text-4xl flex items-center justify-center h-full">
                        {gift.icon_url}
                      </div>
                    </div>
                    {/* Rarity indicator */}
                    {gift.rarity === 'legendary' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                    )}
                    {gift.rarity === 'epic' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                    )}
                    {gift.rarity === 'rare' && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                    )}

                    <p className="text-sm font-medium">{gift.name}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-fuchsia-600 font-medium">
                        {gift.price_in_diamond} 💎
                      </span>
                      <span
                        className={`px-1 py-0.5 rounded text-[10px] font-medium ${
                          gift.rarity === 'legendary'
                            ? 'bg-yellow-100 text-yellow-800'
                            : gift.rarity === 'epic'
                              ? 'bg-purple-100 text-purple-800'
                              : gift.rarity === 'rare'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {gift.rarity.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={handleClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              color="primary"
              onPress={handleSendGift}
              isDisabled={!selectedGift || sending}
              isLoading={sending}
              className="flex-1 bg-gradient-to-r from-fuchsia-500 to-pink-500"
            >
              Send Gift
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
