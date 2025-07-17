'use client';

import { useState, useEffect, useRef } from 'react';
import { Input, Button, Avatar, Chip } from '@heroui/react';
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  limit,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ChatMessage } from '@/types/chat';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatMessageTime = (timestamp: any) => {
  // Handle Firebase Timestamp objects
  let date: Date;

  if (timestamp && typeof timestamp.toDate === 'function') {
    // Firebase Timestamp object
    date = timestamp.toDate();
  } else if (timestamp && typeof timestamp === 'number') {
    // Regular timestamp number
    date = new Date(timestamp);
  } else {
    // Fallback to current time
    date = new Date();
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h`;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

interface LiveChatProps {
  streamId: string;
  channelCode: string;
  className?: string;
}

export const LiveChat = ({
  streamId,
  channelCode,
  className = '',
}: LiveChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user] = useState(`User${Math.floor(Math.random() * 1000)}`);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!channelCode) return;

    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);

        // First, check if collection exists and get existing messages
        const collectionRef = collection(db, `live_comments_${channelCode}`);
        const initialQuery = query(
          collectionRef,
          orderBy('timestamp', 'desc'),
          limit(50)
        );

        const initialSnapshot = await getDocs(initialQuery);
        const existingMessages = initialSnapshot.docs.map(
          (doc) =>
            ({
              id: doc.id,
              ...doc.data(),
            }) as ChatMessage
        );

        setMessages(existingMessages.reverse());
        setLoading(false);

        // Then set up real-time listener
        const unsubscribe = onSnapshot(
          initialQuery,
          (snapshot) => {
            const newMessages = snapshot.docs.map(
              (doc) =>
                ({
                  id: doc.id,
                  ...doc.data(),
                }) as ChatMessage
            );
            setMessages(newMessages.reverse());
          },
          (error) => {
            console.error('Chat listener error:', error);
            setError('Failed to load messages');
          }
        );

        return unsubscribe;
      } catch (err) {
        console.error('Failed to initialize chat:', err);
        setError('Failed to connect to chat');
        setLoading(false);
      }
    };

    const unsubscribePromise = initializeChat();

    return () => {
      unsubscribePromise.then((unsubscribe) => {
        if (unsubscribe) unsubscribe();
      });
    };
  }, [channelCode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    try {
      await addDoc(collection(db, `live_comments_${channelCode}`), {
        user,
        comment: messageText,
        timestamp: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageText); // Restore message on error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col ${className}`}
    >
      {/* Chat Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <h3 className="font-semibold text-sm">Live Chat</h3>
          </div>
          <Chip size="sm" variant="flat" className="bg-white/20 text-white">
            {loading ? '...' : messages.length}
          </Chip>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
        {loading ? (
          <div className="text-center text-gray-500 py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-fuchsia-500 mx-auto mb-2"></div>
            <p className="text-sm">Loading messages...</p>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">
            <p className="text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-fuchsia-500 hover:underline mt-2"
            >
              Retry
            </button>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p className="text-sm">No messages yet</p>
            <p className="text-xs">Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="flex items-start gap-2 hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <Avatar
                size="sm"
                name={msg.user}
                className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white text-xs flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-xs text-gray-800 truncate">
                    {msg.user}
                  </span>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatMessageTime(msg.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 break-words leading-relaxed">
                  {msg.comment}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
        <div className="flex gap-2">
          <Input
            placeholder="Say something..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            maxLength={200}
            size="sm"
            variant="bordered"
          />
          <Button
            size="sm"
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4"
          >
            Send
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-gray-500">Chatting as {user}</span>
          <span className="text-xs text-gray-400">{newMessage.length}/200</span>
        </div>
      </div>
    </div>
  );
};
