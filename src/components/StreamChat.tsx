'use client';

import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'user' | 'system' | 'moderator';
}

interface StreamChatProps {
  streamId: string;
}

export const StreamChat = ({ streamId }: StreamChatProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Sample usernames for simulation
  const sampleUsernames = [
    'StreamFan123', 'LiveViewer', 'ChatMaster', 'VideoLover', 'StreamWatcher',
    'LiveChat99', 'ViewerPro', 'ChatBot2024', 'StreamKing', 'LiveFan'
  ];

  // Sample messages for simulation
  const sampleMessages = [
    'Amazing stream! 🔥',
    'Great quality!',
    'Love this content',
    'Keep it up! 👍',
    'This is awesome',
    'Amazing work!',
    'So good! 💯',
    'Incredible stream',
    'Love watching this',
    'Great job! 🎉',
    'This is perfect',
    'Amazing content!',
    'So entertaining',
    'Love it! ❤️',
    'Keep streaming!'
  ];

  useEffect(() => {
    // Add initial system message
    const systemMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'System',
      message: 'Welcome to the live chat! Be respectful and enjoy the stream.',
      timestamp: new Date(),
      type: 'system'
    };
    
    setMessages([systemMessage]);

    // Simulate incoming messages
    const messageInterval = setInterval(() => {
      if (Math.random() > 0.3) { // 70% chance of new message
        const randomUsername = sampleUsernames[Math.floor(Math.random() * sampleUsernames.length)];
        const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
        
        const newMsg: ChatMessage = {
          id: Date.now().toString() + Math.random(),
          username: randomUsername,
          message: randomMessage,
          timestamp: new Date(),
          type: 'user'
        };
        
        setMessages(prev => [...prev.slice(-49), newMsg]); // Keep last 50 messages
      }
    }, Math.random() * 3000 + 2000); // Random interval 2-5 seconds

    return () => clearInterval(messageInterval);
  }, [streamId]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !isConnected) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      username: 'You',
      message: newMessage.trim(),
      timestamp: new Date(),
      type: 'user'
    };

    setMessages(prev => [...prev.slice(-49), userMessage]);
    setNewMessage('');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getMessageStyle = (type: ChatMessage['type'], username: string) => {
    if (username === 'You') {
      return 'bg-fuchsia-900/30 border-l-4 border-fuchsia-500';
    }
    
    switch (type) {
      case 'system':
        return 'bg-blue-900/30 border-l-4 border-blue-500';
      case 'moderator':
        return 'bg-green-900/30 border-l-4 border-green-500';
      default:
        return 'bg-gray-800/50 hover:bg-gray-700/50';
    }
  };

  const getUsernameColor = (username: string, type: ChatMessage['type']) => {
    if (username === 'You') return 'text-fuchsia-400 font-semibold';
    if (type === 'system') return 'text-blue-400 font-semibold';
    if (type === 'moderator') return 'text-green-400 font-semibold';
    
    // Generate consistent color for username
    const colors = [
      'text-red-400', 'text-yellow-400', 'text-green-400', 'text-blue-400',
      'text-purple-400', 'text-pink-400', 'text-indigo-400', 'text-orange-400'
    ];
    
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-black rounded-lg h-96 flex flex-col text-white">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Live Chat</h3>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-sm">{messages.length - 1} messages</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 p-4 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-3 rounded-lg transition-all duration-200 ${getMessageStyle(message.type, message.username)}`}
          >
            <div className="flex items-start justify-between mb-1">
              <span className={`text-sm font-medium ${getUsernameColor(message.username, message.type)}`}>
                {message.username}
              </span>
              <span className="text-xs text-gray-400">
                {formatTime(message.timestamp)}
              </span>
            </div>
            <p className="text-sm text-gray-100 break-words">{message.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isConnected ? "Type a message..." : "Chat disconnected"}
            disabled={!isConnected}
            className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-fuchsia-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={200}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || !isConnected}
            className="bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:from-fuchsia-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-fuchsia-500 disabled:hover:to-pink-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        
        {/* Chat Info */}
        <div className="mt-2 text-xs text-gray-400 flex items-center justify-between">
          <span>{newMessage.length}/200</span>
          <span>Press Enter to send</span>
        </div>
      </div>
    </div>
  );
};
