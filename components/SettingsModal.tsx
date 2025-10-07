import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  onLanguageChange: (language: string) => void;
  isSoundEnabled: boolean;
  onSoundToggle: () => void;
  onSaveApiKey: (key: string) => void;
}

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// A list of common languages with their BCP-47 codes for the Web Speech API.
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

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, language, onLanguageChange, isSoundEnabled, onSoundToggle, onSaveApiKey }) => {
  const [apiKeyInput, setApiKeyInput] = useState('');
  
  if (!isOpen) {
    return null;
  }

  const handleSaveClick = () => {
    onSaveApiKey(apiKeyInput);
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
    >
      <div 
        className="bg-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <SettingsIcon />
            <h2 id="settings-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Settings</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close settings">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          
          <div>
            <label htmlFor="api-key-input" className="block text-sm font-medium text-purple-300 mb-2">
              Google AI API Key
            </label>
            <div className="flex space-x-2">
              <input
                id="api-key-input"
                type="password"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Enter your API key here"
                className="flex-1 w-full bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
              />
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Your key is required to power the AI and is stored only in your browser session.
            </p>
          </div>

          <hr className="border-gray-600" />

          <div>
            <label htmlFor="language-select" className="block text-sm font-medium text-purple-300 mb-2">
              Voice & Chat Language
            </label>
            <select
              id="language-select"
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
            >
              {supportedLanguages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-2">
              Select the language for AI responses and voice-to-text transcription.
            </p>
          </div>

          <div>
            <label className="flex justify-between items-center cursor-pointer">
              <span className="block text-sm font-medium text-purple-300">
                Sound Effects
              </span>
              <button
                role="switch"
                aria-checked={isSoundEnabled}
                onClick={onSoundToggle}
                className={`${
                  isSoundEnabled ? 'bg-purple-600' : 'bg-gray-600'
                } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800`}
              >
                <span
                  aria-hidden="true"
                  className={`${
                    isSoundEnabled ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                />
              </button>
            </label>
             <p className="text-xs text-gray-400 mt-2">
              Play subtle sounds when sending and receiving messages.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};