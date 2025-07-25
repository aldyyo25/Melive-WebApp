import axios from 'axios';
import {
  Broadcaster,
  StreamDetails,
  StreamingApiResponse,
  Stream,
} from '@/types/streaming';

const API_BASE_URL = 'https://ls-api.mpv.asia/api/streaming';

const AGORA_APP_ID = 'f38d3c28bd964f62abe85c254af23bbd';

class StreamingService {
  private generateUniqueUID(): number {
    // Generate a unique UID using timestamp + random number
    const timestamp = Date.now() % 1000000; // Last 6 digits of timestamp
    const random = Math.floor(Math.random() * 1000); // Random 3 digits
    return parseInt(`${timestamp}${random}`);
  }
  async getBroadcasters(): Promise<Broadcaster[]> {
    try {
      const response = await axios.get<StreamingApiResponse>(API_BASE_URL, {
        timeout: 5000,
      });

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error(response.data.message || 'Invalid API response');
      }

      return response.data.data.map(
        (stream: Stream): Broadcaster => ({
          id: stream.id,
          name: stream.streamer_name || 'Unknown Streamer',
          channel: stream.channel_code,
          status: stream.status === 'LIVE' ? 'live' : 'offline',
          viewers: 0,
        })
      );
    } catch (error) {
      console.error('Failed to fetch broadcasters:', error);
      throw new Error('Failed to fetch broadcasters');
    }
  }

  async getStreamDetails(streamId: string): Promise<StreamDetails> {
    try {
      // Get the stream from the list instead of individual endpoint
      const response = await axios.get<StreamingApiResponse>(API_BASE_URL, {
        timeout: 5000,
      });

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error('Invalid API response');
      }

      const stream = response.data.data.find((s) => s.id === streamId);
      if (!stream) {
        throw new Error('Stream not found');
      }

      return {
        stream_id: stream.id,
        channel: stream.channel_code,
        agora_token: stream.agora_token,
        app_id: AGORA_APP_ID,
        uid: this.generateUniqueUID(),
      };
    } catch (error) {
      console.error('Failed to fetch stream details:', error);
      throw new Error('Failed to fetch stream details');
    }
  }
}

export const streamingService = new StreamingService();
