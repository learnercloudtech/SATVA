import React, { useState } from 'react';
import { Chakra, ChakraStatus } from '../types';

interface ChakraCardProps {
  chakra: Chakra;
}

const statusStyles: { [key in ChakraStatus]: { text: string; } } = {
  [ChakraStatus.Balanced]: { text: 'text-green-400' },
  [ChakraStatus.Blocked]: { text: 'text-red-400' },
  [ChakraStatus.Overactive]: { text: 'text-yellow-400' },
};

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const ChakraCard: React.FC<ChakraCardProps> = ({ chakra }) => {
  const [isOpen, setIsOpen] = useState(false);
  const styles = statusStyles[chakra.status];
  const Icon = chakra.icon;

  return (
    <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:bg-white/10 flex flex-col">
      <div className="p-5 flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white/90">{chakra.name} Chakra</h3>
          <Icon className="w-8 h-8" style={{ color: chakra.color }} />
        </div>
        <div className="mt-3">
          <p className={`text-sm font-medium ${styles.text}`}>
            Status: {chakra.status}
          </p>
        </div>
      </div>
      
      <div className="px-5 pb-5 mt-auto">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex justify-between items-center text-left text-sm font-semibold text-white/60 hover:text-white transition-colors"
        >
          <span>{isOpen ? 'Hide Recommendations' : 'Show Recommendations'}</span>
          <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (
        <div className="bg-black/20 px-5 py-4 border-t border-white/10">
          <ul className="space-y-2 list-disc list-inside">
            {chakra.recommendations.map((rec, index) => (
              <li key={index} className="text-white/70 text-sm">{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChakraCard;