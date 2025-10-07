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
import { AboutModal } from './components/AboutModal.tsx';
import { playMessageSentSound, playMessageReceivedSound } from './utils/sounds.ts';

// --- IMPORTANT SECURITY WARNING ---
// Your API key is hardcoded here and will be VISIBLE to anyone who visits your website.
// It is CRITICAL that you go to your Google Cloud project and set up strict budget alerts
// and API quotas to prevent abuse and unexpected charges.
const API_KEY = 'AIzaSyBhIqOh6gxdWcAdXIFiQLik9Fx1AX6sYTg';

// A sample catalog of products from the user's store.
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

const searchProducts = (query: string): Product[] => {
    const lowerCaseQuery = query.toLowerCase();
    return productCatalog.filter(product => 
        product.name.toLowerCase().includes(lowerCaseQuery) ||
        product.description.toLowerCase().includes(lowerCaseQuery) ||
        product.category.toLowerCase().includes(lowerCaseQuery)
    );
};

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
    return 'English';
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSafetyModalOpen, setIsSafetyModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isInputDisabled, setIsInputDisabled] = useState(true);
  
  const chatRef = useRef<Chat | null>(null);

  // Initialize the AI chat session on initial mount
  useEffect(() => {
    if (!API_KEY || API_KEY === 'PASTE_YOUR_GOOGLE_AI_API_KEY_HERE') {
        setMessages([{
            id: 'error-no-key',
            sender: 'ai',
            text: "Welcome! The AI companion is not configured correctly. The site owner needs to add an API key.",
        }]);
        setIsInputDisabled(true);
        return;
    }
    
    try {
      const languageName = getLanguageName(language);
      const systemInstruction = `You are a friendly, empathetic, and knowledgeable AI companion specializing in sexual wellness and education. Your name is Love4Sex AI. You must provide safe, non-judgmental, and informative advice. Always prioritize user safety, consent, and well-being. Do not generate explicit or pornographic content. Your tone should be supportive and reassuring.

You have a tool called 'searchProducts' to find items from our partner store. If a user's question could be helped by a specific product (like a toy, lubricant, or condom), use this tool to find relevant options. When you recommend a product, present it in a helpful way, including its name and a direct link. Crucially, you MUST respond in ${languageName}.`;

      const ai = new GoogleGenAI({ apiKey: API_KEY });
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
            text: "I'm sorry, the AI companion is currently unavailable. Please try again later.",
        }]);
    }
  }, [language]);

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
          config: { tools: [{ functionDeclarations: [searchProductsTool] }] }
      });

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

  const backgroundSvgUrl = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 80 80'%3e%3cpath d='M0 40 Q 20 20, 40 40 T 80 40' stroke='rgba(192, 132, 252, 0.1)' stroke-width='1' fill='none'/%3e%3c/svg%3e`;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <div className="container mx-auto p-4 flex flex-col flex-1 max-w-4xl">
        <Header 
          onOpenAbout={() => setIsAboutModalOpen(true)}
          onOpenSafetyTips={() => setIsSafetyModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onGeolocate={handleGeolocate}
        />
        <main 
          className="relative flex-1 flex flex-col rounded-2xl shadow-xl overflow-hidden border border-purple-500/10"
          style={{
            backgroundImage: `radial-gradient(ellipse at top, rgba(31, 25, 48, 0.5), transparent), radial-gradient(ellipse at bottom, rgba(48, 25, 40, 0.5), transparent), url('${backgroundSvgUrl}')`,
            backgroundColor: '#0a0514',
            backgroundSize: 'cover, cover, 80px 80px',
          }}
        >
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
      <AboutModal 
        isOpen={isAboutModalOpen} 
        onClose={() => setIsAboutModalOpen(false)} 
      />
      <SettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        isSoundEnabled={isSoundEnabled}
        onSoundToggle={() => setIsSoundEnabled(prev => !prev)}
      />
    </div>
  );
};

export default App;