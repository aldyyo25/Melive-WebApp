import axios from 'axios';
import { Gift, GiftApiResponse } from '@/types/gift';

// Mock data for testing
const MOCK_GIFTS: Gift[] = [
  {
    id: '1',
    name: 'Heart',
    icon_url: '/gifts/heart.png',
    animation_file: '/gifts/heart.mp4',
    price_in_credit: '100',
    price_in_diamond: '10',
    created_at: '2025-07-04 09:19:02',
    updated_at: '2025-07-04 09:52:25',
    deleted_at: null,
  },
  {
    id: '2',
    name: 'Star',
    icon_url: '/gifts/star.png',
    animation_file: '/gifts/star.mp4',
    price_in_credit: '500',
    price_in_diamond: '50',
    created_at: '2025-07-04 09:19:02',
    updated_at: '2025-07-04 09:52:25',
    deleted_at: null,
  },
  {
    id: '3',
    name: 'Crown',
    icon_url: '/gifts/crown.png',
    animation_file: '/gifts/crown.mp4',
    price_in_credit: '1000',
    price_in_diamond: '100',
    created_at: '2025-07-04 09:19:02',
    updated_at: '2025-07-04 09:52:25',
    deleted_at: null,
  },
  {
    id: '4',
    name: 'Diamond',
    icon_url: '/gifts/diamond.png',
    animation_file: '/gifts/diamond.mp4',
    price_in_credit: '5000',
    price_in_diamond: '500',
    created_at: '2025-07-04 09:19:02',
    updated_at: '2025-07-04 09:52:25',
    deleted_at: null,
  },
  {
    id: '5',
    name: 'Special Diamond',
    icon_url: '/gifts/special-diamond.png',
    animation_file: '/gifts/special-diamond.mp4',
    price_in_credit: '200000',
    price_in_diamond: '2000',
    created_at: '2025-07-04 09:19:02',
    updated_at: '2025-07-04 09:52:25',
    deleted_at: null,
  },
];

class GiftService {
  private useMockData = process.env.NODE_ENV === 'development';

  async getGifts(): Promise<Gift[]> {
    try {
      const response = await axios.get<GiftApiResponse>('/api/gifts', {
        timeout: 5000,
      });

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error(response.data.message || 'Invalid API response');
      }

      return response.data.data;
    } catch (error) {
      console.error('Failed to fetch gifts:', error);

      if (this.useMockData) {
        console.log('Using mock gift data');
        return MOCK_GIFTS;
      }

      throw new Error('Failed to fetch gifts');
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