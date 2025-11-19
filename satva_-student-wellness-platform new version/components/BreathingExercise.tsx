import React, { useState, useEffect } from 'react';

const BreathingExercise: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Hold '>('Inhale');
    const [seconds, setSeconds] = useState(4);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds((prev) => {
                    if (prev === 1) {
                        switch (phase) {
                            case 'Inhale':
                                setPhase('Hold');
                                return 4; // Hold for 4
                            case 'Hold':
                                setPhase('Exhale');
                                return 4; // Exhale for 4
                            case 'Exhale':
                                setPhase('Hold '); // Space to differentiate
                                return 4; // Hold for 4
                            case 'Hold ':
                                setPhase('Inhale');
                                return 4;
                            default:
                                return 4;
                        }
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setPhase('Inhale');
            setSeconds(4);
        }
        return () => clearInterval(interval);
    }, [isActive, phase]);

    // Dynamic styles based on phase
    const getCircleStyles = () => {
        if (!isActive) return 'scale-90 opacity-30';
        switch(phase) {
            case 'Inhale': return 'scale-150 opacity-90 duration-[4000ms] ease-out';
            case 'Hold': return 'scale-150 opacity-90 duration-[100ms]'; // Stay expanded
            case 'Exhale': return 'scale-90 opacity-40 duration-[4000ms] ease-in';
            case 'Hold ': return 'scale-90 opacity-40 duration-[100ms]'; // Stay contracted
            default: return 'scale-100';
        }
    };

    return (
        <div className="flex flex-col items-center justify-center py-10 relative overflow-hidden rounded-3xl">
             {onClose && (
                <button onClick={onClose} className="absolute top-0 right-0 z-20 text-white/50 hover:text-white p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            )}
            
            <div className="relative flex items-center justify-center w-80 h-80 mb-8">
                {/* Outer Glow */}
                <div className={`absolute w-64 h-64 rounded-full bg-cyan-400/20 blur-3xl transition-all ${isActive ? 'opacity-60' : 'opacity-20'}`}></div>
                
                {/* Animated Breathing Bubble */}
                <div className={`absolute w-48 h-48 rounded-full bg-gradient-to-br from-cyan-300/40 to-blue-500/40 backdrop-blur-md border border-white/20 shadow-[0_0_30px_rgba(100,200,255,0.3)] transition-all ${getCircleStyles()}`}></div>
                
                {/* Inner Core */}
                <div className={`absolute w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-1000 ${isActive ? 'scale-100' : 'scale-95'}`}>
                    {/* Center Text */}
                    <div className="z-10 text-center">
                        <h3 className="text-xl font-medium text-white tracking-widest uppercase mb-1 drop-shadow-md">
                            {isActive ? phase.trim() : 'Ready'}
                        </h3>
                        {isActive && <span className="text-5xl font-bold text-white drop-shadow-lg">{seconds}</span>}
                    </div>
                </div>
            </div>

            <div className="text-center max-w-md mx-auto z-10 px-4">
                <p className="text-white/70 mb-8 text-lg">
                    {isActive 
                        ? "Sync your breath with the bubble. Find your center." 
                        : "Box breathing is a powerful technique to hack your brain into a calm state."}
                </p>
                
                <button
                    onClick={() => setIsActive(!isActive)}
                    className={`px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl transform hover:scale-105 ${isActive 
                        ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white'}`}
                >
                    {isActive ? 'End Session' : 'Start Breathing'}
                </button>
            </div>
        </div>
    );
};

export default BreathingExercise;