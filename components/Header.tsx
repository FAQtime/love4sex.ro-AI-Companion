import React from 'react';
import { Logo } from './Logo.tsx';

const SafetyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const SettingsIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const LocationIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const AboutIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

interface HeaderProps {
    onOpenSafetyTips: () => void;
    onOpenSettings: () => void;
    onGeolocate: () => void;
    onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSafetyTips, onOpenSettings, onGeolocate, onOpenAbout }) => {
  return (
    <header className="mb-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-y-4">
            <div className="text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-3">
                    <Logo className="h-10 w-10" />
                    <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
                        Love4Sex AI Companion
                    </h1>
                </div>
                <p className="text-sm text-purple-300 mt-1">Your private guide to sexual wellness.</p>
            </div>
            
            <div className="flex items-center space-x-2">
                <button
                    onClick={onGeolocate}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-purple-500/20"
                    aria-label="Set language from location"
                >
                    <LocationIcon />
                </button>
                 <button
                    onClick={onOpenSettings}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-purple-500/20"
                    aria-label="Open settings"
                >
                    <SettingsIcon />
                </button>
                <button
                    onClick={onOpenSafetyTips}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-purple-500/20"
                    aria-label="Open safety tips"
                >
                    <SafetyIcon />
                </button>
                <button
                    onClick={onOpenAbout}
                    className="text-purple-300 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-purple-500/20"
                    aria-label="Open about page"
                >
                    <AboutIcon />
                </button>
            </div>
        </div>
    </header>
  );
};