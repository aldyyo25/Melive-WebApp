import axios from 'axios';
import { Gift, GiftApiResponse } from '@/types/gift';

class GiftService {
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
      return false;
    }
  }
}

export const giftService = new GiftService();
