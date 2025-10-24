import React, { useState, useMemo } from 'react';

interface MoodTrackerProps {
  onSubmit: (mood: number, journal: string) => void;
  isLoading: boolean;
}

const EMOJIS = ['😔', '😟', '😐', '🙂', '😄'];

const MoodTracker: React.FC<MoodTrackerProps> = ({ onSubmit, isLoading }) => {
  const [mood, setMood] = useState(50);
  const [journal, setJournal] = useState('');

  const emoji = useMemo(() => {
    if (mood < 20) return EMOJIS[0];
    if (mood < 40) return EMOJIS[1];
    if (mood < 60) return EMOJIS[2];
    if (mood < 80) return EMOJIS[3];
    return EMOJIS[4];
  }, [mood]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(mood, journal);
  };

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white/90 text-center">How are you feeling today?</h2>
      <p className="text-center text-white/60 mt-2 mb-8">Log your mood to receive personalized insights.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="text-center mb-6">
          <span className="text-7xl transition-transform duration-300 transform hover:scale-110 inline-block">{emoji}</span>
        </div>
        
        <div className="mb-8">
          <input
            type="range"
            min="0"
            max="100"
            value={mood}
            onChange={(e) => setMood(Number(e.target.value))}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#A78BFA]"
          />
           <div className="flex justify-between text-xs text-white/50 mt-2">
            <span>Very Unwell</span>
            <span>Neutral</span>
            <span>Very Well</span>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="journal" className="block text-sm font-medium text-white/70 mb-2">Care to share more?</label>
          <textarea
            id="journal"
            rows={4}
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="Write about your thoughts and feelings..."
            className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white/90 placeholder-white/40"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:bg-gray-500 disabled:from-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze My Chakras'
          )}
        </button>
      </form>
    </div>
  );
};

export default MoodTracker;