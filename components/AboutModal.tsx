import React from 'react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">{title}</h3>
        <div className="space-y-1 text-gray-300">
            {children}
        </div>
    </div>
);

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-title"
    >
      <div 
        className="bg-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <InfoIcon />
            <h2 id="about-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">About This App</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close about page">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-200 space-y-4">
            <Section title="Our Mission">
                <p>
                    The Love4Sex AI Companion is designed to be a safe, private, and non-judgmental space for you to explore topics related to sexual health and wellness. Our mission is to provide accessible, reliable information to help you make informed decisions, improve your intimate life, and foster healthier relationships.
                </p>
            </Section>

            <Section title="Key Features">
                <ul className="list-disc list-inside space-y-2">
                    <li><strong className="text-pink-400">Intelligent Chat:</strong> Ask questions and get empathetic, educational answers from our AI companion, powered by Google's Gemini model.</li>
                    <li><strong className="text-pink-400">Product Recommendations:</strong> The AI can suggest relevant products from our partner store to help you on your journey of exploration.</li>
                    <li><strong className="text-pink-400">Voice-to-Text:</strong> Use your voice to ask questions for a hands-free, conversational experience.</li>
                    <li><strong className="text-pink-400">Multi-Language Support:</strong> Automatically detects your language by location or lets you choose manually for a more natural conversation.</li>
                    <li><strong className="text-pink-400">Essential Safety Tips:</strong> Quick access to crucial information about consent, communication, and safer sex practices.</li>
                </ul>
            </Section>
            
            <Section title="Responsible AI">
                 <p>
                    Your privacy and safety are our top priorities. This AI is an educational tool, not a medical professional. The information provided is for guidance and should not be considered a substitute for professional medical or psychological advice. 
                 </p>
                 <p className="mt-2">
                    The AI is programmed to avoid generating explicit content and to always promote safe, consensual, and healthy interactions. Always consult with a qualified healthcare provider for any personal health concerns.
                </p>
            </Section>

            <p className="text-sm text-center text-gray-500 pt-4">
                We hope you find this tool helpful and empowering.
            </p>
        </div>
      </div>
    </div>
  );
};