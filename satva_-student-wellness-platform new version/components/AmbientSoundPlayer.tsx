import React, { useState, useEffect, useRef } from 'react';

const SoundOnIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>
);

const SoundOffIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);


const AmbientSoundPlayer: React.FC = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // We need to find the audio element in the DOM after the component mounts
        const audioElement = document.getElementById('ambient-audio') as HTMLAudioElement;
        if (audioElement) {
            audioRef.current = audioElement;
            audioRef.current.volume = 0.3; // Set a gentle volume
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(error => {
                    // Autoplay is often blocked by browsers, this is a common issue.
                    console.log("Audio play was prevented by the browser.", error);
                });
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    return (
        <div className="fixed bottom-6 left-6 z-50">
            <button
                onClick={togglePlay}
                className="w-14 h-14 glass-card rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                aria-label={isPlaying ? "Pause ambient sound" : "Play ambient sound"}
            >
                {isPlaying ? <SoundOnIcon className="w-6 h-6" /> : <SoundOffIcon className="w-6 h-6" />}
            </button>
        </div>
    );
};

export default AmbientSoundPlayer;
