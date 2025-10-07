import React from 'react';

interface SafetyTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafetyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const TipSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="mb-4">
        <h3 className="text-xl font-semibold text-purple-300 mb-2">{title}</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300">
            {children}
        </ul>
    </div>
);

export const SafetyTipsModal: React.FC<SafetyTipsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-tips-title"
    >
      <div 
        className="bg-gray-800 border border-purple-500/30 rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <SafetyIcon />
            <h2 id="safety-tips-title" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Essential Safety Tips</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close safety tips">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="text-gray-200 space-y-4">
            <TipSection title="Consent is Key">
                <li><strong className="text-pink-400">Enthusiastic & Ongoing:</strong> Consent should be a clear, enthusiastic "yes!" and can be checked in on throughout any experience.</li>
                <li><strong className="text-pink-400">Reversible:</strong> Anyone can change their mind and withdraw consent at any time, for any reason.</li>
                <li><strong className="text-pink-400">Specific:</strong> Consenting to one activity doesn't mean consenting to others.</li>
            </TipSection>

            <TipSection title="Communication">
                <li><strong className="text-purple-400">Talk Openly:</strong> Discuss boundaries, desires, and comfort levels with your partner(s) before and during sexual activity.</li>
                <li><strong className="text-purple-400">Use Safe Words:</strong> Especially when exploring new things, a safe word is a clear way to stop immediately.</li>
            </TipSection>

            <TipSection title="Safer Sex Practices (STI Prevention)">
                <li><strong className="text-pink-400">Use Barriers:</strong> Condoms (external and internal) and dental dams significantly reduce the risk of transmitting sexually transmitted infections (STIs).</li>
                <li><strong className="text-pink-400">Get Tested:</strong> Regular STI testing is a crucial part of responsible sexual health for anyone who is sexually active.</li>
                <li><strong className="text-pink-400">Be Honest:</strong> Have open conversations with partners about sexual history and STI status.</li>
            </TipSection>
            
            <TipSection title="Toy Safety & Hygiene">
                <li><strong className="text-purple-400">Clean Your Toys:</strong> Always clean toys before and after each use according to the manufacturer's instructions.</li>
                <li><strong className="text-purple-400">Body-Safe Materials:</strong> Choose toys made from non-porous, body-safe materials like 100% silicone, glass, or stainless steel.</li>
                <li><strong className="text-purple-400">Use Lubricant:</strong> Lube can increase comfort and pleasure while reducing the risk of friction or injury.</li>
            </TipSection>

            <p className="text-sm text-center text-gray-500 pt-4">
                This information is for educational purposes. For medical concerns, please consult a healthcare professional.
            </p>
        </div>
      </div>
    </div>
  );
};
