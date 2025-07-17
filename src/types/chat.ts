export interface ChatMessage {
  id: string;
  user: string;
  comment: string;
  timestamp: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  streamId?: string;
}

export interface ChatUser {
  id: string;
  username: string;
  avatar?: string;
}
