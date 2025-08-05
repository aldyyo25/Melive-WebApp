import axios from 'axios';
import {
  Broadcaster,
  StreamDetails,
  StreamingApiResponse,
  Stream,
} from '@/types/streaming';

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

const AGORA_APP_ID = 'f38d3c28bd964f62abe85c254af23bbd';

const MOCK_STREAM_DETAILS: StreamDetails = {
  stream_id: 'test-stream',
  channel: 'test-channel',
  agora_token: 'test-token',
  app_id: AGORA_APP_ID,
  uid: 123,
};

class StreamingService {
  private useMockData = process.env.NODE_ENV === 'development';

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
          name: stream.streamer_name,
          channel: stream.channel_code,
          status: stream.status === 'LIVE' ? 'live' : 'offline',
          viewers: 0,
        })
      );
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
        //channel: 'melive_channel_492218',
        //token:'006f38d3c28bd964f62abe85c254af23bbdIACKnym31eOj1ww4AxJUJE0WlAtB49iFRCgADNXggaST3P6UJH4AAAAAIgDDOaoKMmJ3aAQAAQDCHnZoAgDCHnZoAwDCHnZoBADCHnZo',
        channel: stream.channel_code,
        agora_token: stream.agora_token,
        app_id: AGORA_APP_ID,
        uid: this.generateUniqueUID(),
      };
    } catch (error) {
      console.error('Failed to fetch stream details:', error);

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
