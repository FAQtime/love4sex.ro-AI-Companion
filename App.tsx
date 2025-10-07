import React, { useState, useRef, useEffect, useCallback } from 'react';
// FIX: Import correct GenAI classes and types as per documentation.
import { GoogleGenAI, Chat, FunctionDeclaration, Type, Part } from '@google/genai';

import type { DisplayMessage, Product } from './types.ts';
import { Header } from './components/Header.tsx';
import { ChatWindow } from './components/ChatWindow.tsx';
import { MessageInput } from './components/MessageInput.tsx';
import { StoreLink } from './components/StoreLink.tsx';
import { SafetyTipsModal } from './components/SafetyTipsModal.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { playMessageSentSound, playMessageReceivedSound } from './utils/sounds.ts';

// A sample catalog of products from the user's store.
// In a real-world application, this would likely be fetched from a backend API.
const productCatalog: Product[] = [
  { name: 'We-Vibe Nova 2', description: 'A popular rabbit-style vibrator for couples, offering simultaneous clitoral and G-spot stimulation.', url: 'https://love4sex.ro/wordpress/index.php/produs/we-vibe-nova-2/', category: 'vibrator' },
  { name: 'Lelo Sona Cruise 2', description: 'A sonic clitoral massager that uses sonic waves for a unique and intense form of pleasure.', url: 'https://love4sex.ro/wordpress/index.php/produs/lelo-sona-cruise-2-black/', category: 'vibrator' },
  { name: 'Satisfyer Pro 2 Next Generation', description: 'An air-pulse stimulator that provides touch-free clitoral stimulation.', url: 'https://love4sex.ro/wordpress/index.php/produs/satisfyer-pro-2-next-generation/', category: 'vibrator' },
  { name: 'Durex Invisible Extra Lubricated Condoms', description: 'Extra thin and extra lubricated condoms for heightened sensitivity and comfort.', url: 'https://love4sex.ro/wordpress/index.php/produs/prezervative-durex-invisible-extra-lubricated-10-buc/', category: 'condom' },
  { name: 'Water-Based Lubricant', description: 'A high-quality, body-safe water-based lubricant suitable for all toys and condoms.', url: 'https://love4sex.ro/wordpress/index.php/produs/lubrifiant-pe-baza-de-apa-pjur-aqua-100-ml/', category: 'lubricant' },
  { name: 'Obsessive Bodystocking F202', description: 'An alluring and seductive fishnet bodystocking that accentuates curves and ignites passion.', url: 'https://love4sex.ro/wordpress/index.php/produs/obsessive-bodystocking-f202-negru/', category: 'lingerie' },
  { name: 'Potent Forte Male Enhancement', description: 'A natural supplement designed to support male vitality, stamina, and performance.', url: 'https://love4sex.ro/wordpress/index.php/produs/potent-forte-pentru-barbati-1-capsula/', category: 'supplement' },
  { name: 'Kama Sutra Love Game', description: 'An erotic board game for couples to explore new levels of intimacy and playfulness.', url: 'https://love4sex.ro/wordpress/index.php/produs/joc-erotic-kama-sutra-love-game/', category: 'couples game' },
  { name: 'Beginner\'s Anal Plug Set', description: 'A set of three silicone anal plugs of increasing size, perfect for beginners exploring anal play.', url: 'https://love4sex.ro/wordpress/index.php/produs/set-3-pluguri-anale-din-silicon-pentru-incepatori/', category: 'anal toy' },
  { name: 'Satin Love Bondage Kit', description: 'A 5-piece bondage kit with satin cuffs, blindfold, and rope for gentle and sensual restraint play.', url: 'https://love4sex.ro/wordpress/index.php/produs/set-bondage-din-satin-5-piese/', category: 'bdsm' },
  { name: 'Stretchy Penis Extender Sleeve', description: 'A realistic and stretchy penis sleeve that adds length and girth for enhanced partner pleasure.', url: 'https://love4sex.ro/wordpress/index.php/produs/extensie-penis-cu-inel-pentru-testicule-realistic/', category: 'sleeve' },
  { name: 'Fleshlight Flight Aviator', description: 'A compact and discreet male masturbator with a super-soft, realistic texture for intense solo pleasure.', url: 'https://love4sex.ro/wordpress/index.php/produs/fleshlight-flight-aviator/', category: 'masturbator' },
  { name: 'Durex Pleasure Me Condoms', description: 'Condoms with a stimulating ribbed and dotted texture designed to increase pleasure for both partners.', url: 'https://love4sex.ro/wordpress/index.php/produs/prezervative-durex-pleasure-me-3-buc/', category: 'condom' },
];

// Function to search the product catalog
const searchProducts = (query: string): Product[] => {
    const lowerCaseQuery = query.toLowerCase();
    return productCatalog.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
    );
};

// Define the tool for the AI model
const searchProductsTool: FunctionDeclaration = {
    name: 'searchProducts',
    description: 'Searches the partner store catalog for relevant sex toys, condoms, or lubricants.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            query: {
                type: Type.STRING,
                description: 'The search term for the product, e.g., "vibrator for couples", "lubricant".',
            },
        },
        required: ['query'],
    },
};

// Map country codes (ISO 3166-1 alpha-2) to language information
const countryToLanguageMap: { [key: string]: { code: string; name: string } } = {
  'ro': { code: 'ro-RO', name: 'Romanian' },
  'de': { code: 'de-DE', name: 'German' },
  'fr': { code: 'fr-FR', name: 'French' },
  'es': { code: 'es-ES', name: 'Spanish' },
  'it': { code: 'it-IT', name: 'Italian' },
  'mx': { code: 'es-MX', name: 'Spanish' },
  'gb': { code: 'en-GB', name: 'English' },
  'us': { code: 'en-US', name: 'English' },
  'br': { code: 'pt-BR', name: 'Portuguese' },
  'jp': { code: 'ja-JP', name: 'Japanese' },
  'kr': { code: 'ko-KR', name: 'Korean' },
  'cn': { code: 'zh-CN', name: 'Chinese' },
};

const supportedLanguages = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'en-GB', name: 'English (UK)' },
  { code: 'es-ES', name: 'Español (España)' },
  { code: 'es-MX', name: 'Español (México)' },
  { code: 'fr-FR', name: 'Français' },
  { code: 'de-DE', name: 'Deutsch' },
  { code: 'it-IT', name: 'Italiano' },
  { code: 'pt-BR', name: 'Português (Brasil)' },
  { code: 'ro-RO', name: 'Română' },
  { code: 'ja-JP', name: '日本語' },
  { code: 'ko-KR', name: '한국어' },
  { code: 'zh-CN', name: '中文 (简体)' },
];

const getLanguageName = (code: string) => {
    const lang = supportedLanguages.find(l => l.code === code);
    if (lang) {
        if (lang.name.includes(' (')) {
            return lang.name.split(' (')[0];
        }
        return lang.name;
    }
    return 'English'; // Fallback
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [language, setLanguage] = useState('en-US'); // Default language
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  const [apiKey, setApiKey] = useState<string | null>(null);
  
  const chatRef = useRef<Chat | null>(null);
  
  // On initial load, check for an API key in sessionStorage.
  useEffect(() => {
    const storedKey = sessionStorage.getItem('gemini-api-key');
    if (storedKey) {
        setApiKey(storedKey);
    } else {
        setMessages([{
            id: 'init-no-key',
            sender: 'ai',
            text: "Welcome! To get started, please add your Google AI API Key in the Settings menu (⚙️). Your key is stored securely in your browser's session and is never shared.",
        }]);
    }
  }, []);

  // Initialize/re-initialize the AI model and chat session when the API key or language changes.
  useEffect(() => {
    if (!apiKey) {
      setIsInputDisabled(true);
      return;
    }
    
    try {
      const languageName = getLanguageName(language);
      const systemInstruction = `You are a friendly, empathetic, and knowledgeable AI companion specializing in sexual wellness and education. Your name is Love4Sex AI. You must provide safe, non-judgmental, and informative advice. Always prioritize user safety, consent, and well-being. Do not generate explicit or pornographic content. Your tone should be supportive and reassuring.

You have a tool called 'searchProducts' to find items from our partner store. If a user's question could be helped by a specific product (like a toy, lubricant, or condom), use this tool to find relevant options. When you recommend a product, present it in a helpful way, including its name and a direct link. Crucially, you MUST respond in ${languageName}.`;

      const ai = new GoogleGenAI({ apiKey: apiKey });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: systemInstruction,
        },
      });
      
      const welcomeMessage: DisplayMessage = {
          id: 'init-success',
          sender: 'ai',
          text: `Hello! I'm your private AI companion, here to help you explore sexual wellness in ${languageName}. How can I help you today?`,
      };
      setMessages([welcomeMessage]);
      setIsInputDisabled(false);

    } catch (error) {
        console.error("Failed to initialize AI:", error);
        setIsInputDisabled(true);
        setMessages([{
            id: 'error-init',
            sender: 'ai',
            text: "I'm sorry, I couldn't connect with that API Key. Please check the key in Settings and try again.",
        }]);
    }
  }, [apiKey, language]);

  const handleSaveApiKey = (key: string) => {
    if (key.trim()) {
      setApiKey(key.trim());
      sessionStorage.setItem('gemini-api-key', key.trim());
      setIsSettingsModalOpen(false);
    }
  };
  
  const handleGeolocate = useCallback(() => {
    if (!navigator.geolocation) {
        setMessages(prev => [...prev, {
            id: 'geo-error-unsupported', sender: 'ai',
            text: "Sorry, geolocation is not supported by your browser.",
        }]);
        return;
    }

    setMessages(prev => [...prev, {
        id: 'geo-info-requesting', sender: 'ai',
        text: "Requesting your location to set your language...",
    }]);

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=en`);
                if (!response.ok) throw new Error(`API Error: ${response.status}`);
                
                const data = await response.json();
                const countryCode = data.address?.country_code;
                const countryName = data.address?.country || "your country";

                if (countryCode && countryToLanguageMap[countryCode]) {
                    const languageInfo = countryToLanguageMap[countryCode];
                    setLanguage(languageInfo.code);
                    // The useEffect for language change will handle the new welcome message.
                } else {
                    setMessages(prev => [...prev, {
                        id: 'geo-info-notfound', sender: 'ai',
                        text: `I've detected your location in ${countryName}, but I don't have a specific language setting for it. We'll continue in English.`,
                    }]);
                }
            } catch (error) {
                console.error("Reverse geocoding failed:", error);
                setMessages(prev => [...prev, {
                    id: 'geo-error-fetch', sender: 'ai',
                    text: "I couldn't determine your language from your location. Please select it manually in the settings.",
                }]);
            }
        },
        (error) => {
            console.error("Geolocation error:", error.message);
            setMessages(prev => [...prev, {
                id: 'geo-error-denied', sender: 'ai',
                text: "You've disabled location access. You can still set your language manually in the settings.",
            }]);
        }
    );
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading || isInputDisabled) return;

    const newUserMessage: DisplayMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: text,
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsLoading(true);
    if (isSoundEnabled) playMessageSentSound();

    try {
      if (!chatRef.current) {
        throw new Error("Chat session not initialized.");
      }
      
      let response = await chatRef.current.sendMessage({ 
          message: text,
          // Add the tool to the request
          config: { tools: [{ functionDeclarations: [searchProductsTool] }] }
      });

      // Check if the model wants to call a function
      if (response.functionCalls && response.functionCalls.length > 0) {
        const toolResponses: {
            id: string;
            name: string;
            response: { result: string };
        }[] = [];
        
        for (const fc of response.functionCalls) {
            if (fc.name === 'searchProducts') {
                const query = fc.args.query as string;
                const searchResults = searchProducts(query);
                
                toolResponses.push({
                    id: fc.id,
                    name: fc.name,
                    response: {
                        result: JSON.stringify(searchResults)
                    }
                });
            }
        }
        
        const functionResponseParts: Part[] = toolResponses.map(toolResp => ({
            functionResponse: {
                name: toolResp.name,
                response: toolResp.response,
            },
        }));

        response = await chatRef.current.sendMessage({
            message: functionResponseParts,
        });
      }

      const aiResponseText = response.text;
      if (!aiResponseText) {
          throw new Error("Received an empty response from the AI.");
      }
      
      const newAiMessage: DisplayMessage = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: aiResponseText.trim(),
      };
      
      setMessages(prev => [...prev, newAiMessage]);
      if (isSoundEnabled) playMessageReceivedSound();

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: DisplayMessage = {
        id: Date.now().toString() + '-error',
        sender: 'ai',
        text: "I'm sorry, I encountered an error. Please try again later.",
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isSoundEnabled, isInputDisabled]);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <div className="container mx-auto p-4 flex flex-col flex-1 max-w-4xl">
        <Header 
          onOpenSafetyTips={() => setIsSafetyModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onGeolocate={handleGeolocate}
        />
        <main className="flex-1 flex flex-col bg-black bg-opacity-20 rounded-2xl shadow-xl overflow-hidden border border-purple-500/10">
          <ChatWindow messages={messages} isLoading={isLoading} />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isLoading={isLoading || isInputDisabled}
            language={language}
          />
        </main>
        <StoreLink />
      </div>
      <SafetyTipsModal 
        isOpen={isSafetyModalOpen} 
        onClose={() => setIsSafetyModalOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        isSoundEnabled={isSoundEnabled}
        onSoundToggle={() => setIsSoundEnabled(prev => !prev)}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
};

export default App;