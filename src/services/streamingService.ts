import axios from 'axios';
import { Broadcaster, StreamDetails, StreamingApiResponse, Stream } from '@/types/streaming';

const API_BASE_URL = 'https://ls-api.mpv.asia/api/streaming';

// Mock data for testing
const MOCK_BROADCASTERS: Broadcaster[] = [
  {
    id: 'broadcaster-1',
    name: 'Test Broadcaster 1',
    channel: 'test-channel-1',
    status: 'live',
    viewers: 150,
    thumbnail: '/api/placeholder/320/180',
  },
  {
    id: 'broadcaster-2',
    name: 'Test Broadcaster 2',
    channel: 'test-channel-2',
    status: 'offline',
    viewers: 0,
  },
];

const MOCK_STREAM_DETAILS: StreamDetails = {
  stream_id: 'test-stream',
  channel: 'test-channel',
  token: 'test-token',
  app_id: 'f38d3c28bd964f62abe85c254af23bbd',
  uid: 12345,
};

class StreamingService {
  private useMockData = process.env.NODE_ENV === 'development';

  async getBroadcasters(): Promise<Broadcaster[]> {
    try {
      const response = await axios.get<StreamingApiResponse>(API_BASE_URL, {
        timeout: 5000,
      });

      if (!response.data.success || !Array.isArray(response.data.data)) {
        throw new Error(response.data.message || 'Invalid API response');
      }

      return response.data.data.map((stream: Stream): Broadcaster => ({
        id: stream.id,
        name: stream.streamer_name,
        channel: stream.channel_code,
        status: stream.status === 'LIVE' ? 'live' : 'offline',
        viewers: 0,
      }));
    } catch (error) {
      console.error('Failed to fetch broadcasters:', error);

      if (this.useMockData) {
        console.log('Using mock broadcaster data');
        return MOCK_BROADCASTERS;
      }

      throw new Error('Failed to fetch broadcasters');
    }
  }

  async getStreamDetails(streamId: string): Promise<StreamDetails> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${streamId}`, {
        timeout: 5000,
      });

      const data = response.data;
      return {
        stream_id: data.stream_id || data.id || streamId,
        channel: data.channel || data.channelName || 'unknown-channel',
        token: data.agora_token ,
        app_id: 'f38d3c28bd964f62abe85c254af23bbd',
        uid: data.uid || Math.floor(Math.random() * 10000),
      };
    } catch (error) {
      console.error('Failed to fetch stream details:', error);

      // Return mock data in development
      if (this.useMockData) {
        console.log('Using mock stream details');
        return {
          ...MOCK_STREAM_DETAILS,
          stream_id: streamId,
          channel: `channel-${streamId}`,
        };
      }

      throw new Error('Failed to fetch stream details');
    }
  }
}

export const streamingService = new StreamingService();
