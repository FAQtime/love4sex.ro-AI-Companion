import React, { useEffect, useRef } from 'react';
import type { DisplayMessage } from '../types';
import { ChatMessage } from './ChatMessage.tsx';

interface ChatWindowProps {
  messages: DisplayMessage[];
  isLoading: boolean;
}

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.828 9.172a4 4 0 015.656 0L12 10.686l1.516-1.514a4 4 0 115.656 5.656L12 20.314l-7.172-7.172a4 4 0 010-5.656z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
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