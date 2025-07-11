export interface Stream {
  id: string;
  streamer_id: string;
  channel_code: string;
  status: 'LIVE' | 'ENDED' | 'BACKSTAGE';
  agora_token: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  streamer_name: string;
}

export interface StreamingApiResponse {
  success: boolean;
  message: string;
  data: Stream[];
}

export interface Broadcaster {
  id: string;
  name: string;
  channel: string;
  status: 'live' | 'offline';
  viewers?: number;
  thumbnail?: string;
}

export interface StreamingResponse {
  broadcasters: Broadcaster[];
}

export interface StreamDetails {
  stream_id: string;
  channel: string;
  token: string;
  app_id: string;
  uid?: number;
}

export interface StreamingError {
  message: string;
  code?: string;
}
