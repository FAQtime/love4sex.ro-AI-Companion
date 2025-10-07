import React, { useState, useEffect, useRef } from 'react';

// FIX: Add TypeScript definitions for the Web Speech API
// The Web Speech API is not yet a W3C standard and TypeScript's standard library files may not include it.
// These declarations provide the necessary types to use the API without compilation errors.
interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
}

interface SpeechRecognitionStatic {
    new(): SpeechRecognition;
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;

    start(): void;
    stop(): void;
    abort(): void;

    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

// Extend the Window interface to include SpeechRecognition and its prefixed variant.
declare global {
    interface Window {
        SpeechRecognition: SpeechRecognitionStatic;
        webkitSpeechRecognition: SpeechRecognitionStatic;
    }
}

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  language: string;
}

const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
    </svg>
);


const MAX_CHAR_LIMIT = 2000;

export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isLoading, language }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn("Speech recognition not supported by this browser.");
      return;
    }
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    // FIX: Add explicit type for the event parameter to align with the new interface
    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        alert(`Speech recognition error: ${event.error}. Please check your microphone permissions.`);
        setIsListening(false);
    };

    // FIX: Add explicit type for the event parameter to align with the new interface
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setText(prev => (prev ? prev + ' ' : '') + transcript);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };

  }, [language]);

  const handleMicClick = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;

    if (isListening) {
      recognition.stop();
    } else {
       try {
        recognition.start();
       } catch(e) {
        console.error("Could not start recognition:", e);
        alert("Could not start voice recognition. It might already be active or an error occurred.");
       }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && text.length <= MAX_CHAR_LIMIT) {
      onSendMessage(text);
      setText('');
    }
  };
  
  const isInputEmpty = text.trim().length === 0;
  const isOverLimit = text.length > MAX_CHAR_LIMIT;
  const isSubmitDisabled = isLoading || isInputEmpty || isOverLimit;
  
  const charCountColor = isOverLimit 
    ? 'text-red-400' 
    : text.length > MAX_CHAR_LIMIT * 0.9 
    ? 'text-yellow-400' 
    : 'text-gray-400';

  return (
    <div className="p-4 md:p-6 border-t border-purple-500/20">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <div className="relative flex-1 min-w-0">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask about your intimate life..."
            disabled={isLoading}
            maxLength={MAX_CHAR_LIMIT}
            className="flex-1 w-full bg-gray-800 text-white placeholder-gray-400 rounded-full py-3 pl-5 pr-20 sm:pr-24 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300 disabled:opacity-50"
            aria-describedby={isOverLimit ? "char-limit-error" : "char-count"}
          />
          <div
            id="char-count"
            className={`absolute inset-y-0 right-0 flex items-center pr-5 text-sm pointer-events-none font-mono ${charCountColor}`}
            aria-live="polite"
          >
            {text.length}/{MAX_CHAR_LIMIT}
          </div>
        </div>
        
        <button
          type="button"
          onClick={handleMicClick}
          disabled={isLoading}
          aria-label={isListening ? "Stop listening" : "Start listening"}
          className={`p-3 rounded-full transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${isListening ? 'bg-purple-600 text-white animate-pulse' : 'bg-gray-700 text-purple-300 hover:bg-gray-600'}`}
        >
          <MicIcon />
        </button>

        <button
          type="submit"
          disabled={isSubmitDisabled}
          aria-label="Send message"
          className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-pink-500 transition-transform duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
        >
          <SendIcon />
        </button>
      </form>
      {isOverLimit && (
        <p id="char-limit-error" className="text-red-400 text-xs text-center mt-2" role="alert">
          Character limit exceeded. Please shorten your message.
        </p>
      )}
    </div>
  );
};