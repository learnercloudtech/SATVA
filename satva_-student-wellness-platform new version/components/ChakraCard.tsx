import React, { useState } from 'react';
import { ChakraUI, ChakraStatus } from '../types';

interface ChakraCardProps {
  chakra: ChakraUI;
  index: number;
}

const statusColors: { [key in ChakraStatus]: string } = {
  [ChakraStatus.Balanced]: 'bg-green-500',
  [ChakraStatus.Blocked]: 'bg-red-500',
  [ChakraStatus.Overactive]: 'bg-yellow-500',
};

const ChakraCard: React.FC<ChakraCardProps> = ({ chakra, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = chakra.icon;

  return (
    <div 
      className="group relative rounded-3xl overflow-hidden bg-black/40 border border-white/10 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-white/5 animate-fade-in-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
        >
            <source src={chakra.videoUrl} type="video/mp4" />
            <source src={chakra.videoUrl} type="video/webm" />
        </video>
        {/* Gradient Overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
      </div>

      {/* Icon as a colored background element */}
      {IconComponent && (
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <IconComponent
            className="w-full h-full opacity-25 transition-all duration-500 group-hover:opacity-40"
            style={{
              color: chakra.color,
              filter: `drop-shadow(0 0 8px ${chakra.color})`
            }}
          />
        </div>
      )}

      <div className="relative z-10 p-6 flex flex-col h-full min-h-[320px]">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
            <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">{chakra.name}</h3>
                <p className="text-white/60 text-sm font-medium uppercase tracking-widest">{chakra.description}</p>
            </div>
            <div className={`w-3 h-3 rounded-full ${statusColors[chakra.status]} shadow-[0_0_10px_currentColor]`}></div>
        </div>

        {/* Status Indicator */}
        <div className="mt-auto">
             <div className="mb-4">
                <span className="text-xs text-white/50 uppercase tracking-wider">Current State</span>
                <p className={`text-lg font-medium ${
                    chakra.status === ChakraStatus.Balanced ? 'text-green-300' : 
                    chakra.status === ChakraStatus.Blocked ? 'text-red-300' : 'text-yellow-300'
                }`}>
                    {chakra.status}
                </p>
            </div>

            {/* Expandable Recommendations */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}>
                 <ul className="space-y-2 mb-4">
                    {chakra.recommendations.map((rec, i) => (
                        <li key={i} className="text-sm text-white/80 flex items-start">
                            <span className="mr-2 mt-1.5 w-1 h-1 bg-white/50 rounded-full flex-shrink-0"></span>
                            {rec}
                        </li>
                    ))}
                </ul>
            </div>

            <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white text-sm font-bold transition-colors border border-white/10"
            >
                {isExpanded ? 'Close Insights' : 'View Recommendations'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ChakraCard;