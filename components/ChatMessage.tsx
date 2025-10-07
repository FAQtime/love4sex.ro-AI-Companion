import React from 'react';
import type { DisplayMessage } from '../types.ts';

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const AIIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-pink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.828 9.172a4 4 0 015.656 0L12 10.686l1.516-1.514a4 4 0 115.656 5.656L12 20.314l-7.172-7.172a4 4 0 010-5.656z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Function to find URLs in text and convert them to clickable links
const linkify = (text: string): React.ReactNode => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a 
                    key={index}
                    href={part} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-pink-400 hover:text-pink-300 underline"
                >
                    {part}
                </a>
            );
        }
        return part;
    });
};


export const ChatMessage: React.FC<{ message: DisplayMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const containerClasses = isUser ? 'flex justify-end items-start gap-3' : 'flex justify-start items-start gap-3';
  const bubbleClasses = isUser 
    ? 'bg-purple-600 text-white rounded-t-2xl rounded-bl-2xl' 
    : 'bg-gray-800 text-gray-200 rounded-t-2xl rounded-br-2xl';

  return (
    <div className={containerClasses}>
      {!isUser && <div className="flex-shrink-0 mt-1"><AIIcon /></div>}
      <div className={`${bubbleClasses} p-3 max-w-md md:max-w-lg lg:max-w-xl break-words shadow-lg`}>
        <p className="whitespace-pre-wrap">{linkify(message.text)}</p>
      </div>
      {isUser && <div className="flex-shrink-0 mt-1"><UserIcon /></div>}
    </div>
  );
};