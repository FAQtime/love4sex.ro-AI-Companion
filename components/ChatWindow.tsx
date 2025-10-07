import React, { useEffect, useRef } from 'react';
import type { DisplayMessage } from '../types';
import { ChatMessage } from './ChatMessage.tsx';

interface ChatWindowProps {
  messages: DisplayMessage[];
  isLoading: boolean;
}

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20">
        <defs>
        <linearGradient id="aiIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#f472b6' }} /> {/* pink-400 */}
            <stop offset="100%" style={{ stopColor: '#c084fc' }} /> {/* purple-400 */}
        </linearGradient>
        </defs>
        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" fill="url(#aiIconGrad)" />
    </svg>
);

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-1.5">
    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
    <div style={{ animationDelay: '200ms' }} className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
    <div style={{ animationDelay: '400ms' }} className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
  </div>
);

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div ref={scrollRef} className="flex-1 p-4 md:p-6 overflow-y-auto space-y-4">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      {isLoading && (
        <div className="flex justify-start items-start gap-3">
          <div className="flex-shrink-0 mt-1"><AIIcon /></div>
          <div className="bg-gray-800 text-gray-200 rounded-t-2xl rounded-br-2xl p-3 shadow-lg">
              <TypingIndicator />
          </div>
        </div>
      )}
    </div>
  );
};