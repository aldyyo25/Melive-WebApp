import axios from 'axios';
import { Gift, GiftApiResponse } from '@/types/gift';

// Mock data for testing with simple emojis for icons and public Lottie animations
const MOCK_GIFTS: Gift[] = [
  {
    id: '1',
    name: 'Heart',
    icon_url: '❤️',
    animation_file: 'https://assets3.lottiefiles.com/packages/lf20_V9t630.json',
    lottie_url: 'https://assets3.lottiefiles.com/packages/lf20_V9t630.json',
    price_in_credit: '100',
    price_in_diamond: '10',
    rarity: 'common',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '2',
    name: 'Star',
    icon_url: '⭐',
    animation_file:
      'https://assets3.lottiefiles.com/packages/lf20_s2lryxtd.json',
    lottie_url: 'https://assets3.lottiefiles.com/packages/lf20_s2lryxtd.json',
    price_in_credit: '500',
    price_in_diamond: '50',
    rarity: 'common',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '3',
    name: 'Crown',
    icon_url: '👑',
    animation_file:
      'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json',
    lottie_url: 'https://assets5.lottiefiles.com/packages/lf20_touohxv0.json',
    price_in_credit: '1000',
    price_in_diamond: '100',
    rarity: 'rare',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '4',
    name: 'Diamond',
    icon_url: '💎',
    animation_file:
      'https://assets3.lottiefiles.com/private_files/lf30_WdTEui.json',
    lottie_url:
      'https://assets3.lottiefiles.com/private_files/lf30_WdTEui.json',
    price_in_credit: '5000',
    price_in_diamond: '500',
    rarity: 'epic',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '5',
    name: 'Fireworks',
    icon_url: '🎆',
    animation_file:
      'https://assets3.lottiefiles.com/packages/lf20_rovf92ey.json',
    lottie_url: 'https://assets3.lottiefiles.com/packages/lf20_rovf92ey.json',
    price_in_credit: '200000',
    price_in_diamond: '2000',
    rarity: 'legendary',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '6',
    name: 'Rose',
    icon_url: '🌹',
    animation_file:
      'https://assets9.lottiefiles.com/packages/lf20_m3ub4ucr.json',
    lottie_url: 'https://assets9.lottiefiles.com/packages/lf20_m3ub4ucr.json',
    price_in_credit: '250',
    price_in_diamond: '25',
    rarity: 'common',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '7',
    name: 'Gift Box',
    icon_url: '🎁',
    animation_file:
      'https://assets4.lottiefiles.com/packages/lf20_25CTuxSjYO.json',
    lottie_url: 'https://assets4.lottiefiles.com/packages/lf20_25CTuxSjYO.json',
    price_in_credit: '3000',
    price_in_diamond: '300',
    rarity: 'epic',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
  {
    id: '8',
    name: 'Rainbow',
    icon_url: '🌈',
    animation_file:
      'https://assets8.lottiefiles.com/packages/lf20_kyu5tcxw.json',
    lottie_url: 'https://assets8.lottiefiles.com/packages/lf20_kyu5tcxw.json',
    price_in_credit: '10000',
    price_in_diamond: '1000',
    rarity: 'legendary',
    created_at: '2025-01-08 09:19:02',
    updated_at: '2025-01-08 09:52:25',
    deleted_at: null,
  },
];

class GiftService {
  private useMockData = process.env.NODE_ENV === 'development';

  async getGifts(): Promise<Gift[]> {
    try {
      // First try to fetch from API
      try {
        const response = await axios.get<GiftApiResponse>('/api/gifts', {
          timeout: 5000,
        });

        if (response.data.success && Array.isArray(response.data.data)) {
          // Process and validate each gift
          return response.data.data.map((gift) => ({
            ...gift,
            // Provide fallback for missing images
            icon_url: gift.icon_url || '/default-image.jpg',
            animation_file: gift.animation_file || '/sample-video.mp4',
          }));
        }
      } catch (apiError) {
        console.error('API fetch failed:', apiError);
        // Continue to fallback
      }

      // Fallback to mock data
      console.log('Using mock gift data');
      return MOCK_GIFTS;
    } catch (error) {
      console.error('Failed to fetch gifts:', error);
      return MOCK_GIFTS; // Always return mock data as final fallback
    }
  }

  async sendGift(streamId: string, giftId: string): Promise<boolean> {
    try {
      const response = await axios.post('/api/gifts/send', {
        streamId,
        giftId,
      });

      return response.data.success;
    } catch (error) {
      console.error('Failed to send gift:', error);

      if (this.useMockData) {
        console.log('Mock gift sent successfully');
        return true;
      }

      return false;
    }
  }
}

export const giftService = new GiftService();
