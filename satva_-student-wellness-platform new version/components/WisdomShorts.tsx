
import React, { useState, useRef } from 'react';
import { generateSpeech } from '../services/geminiService';

const PlayCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10"></circle>
    <polygon points="10 8 16 12 10 16 10 8" fill="currentColor"></polygon>
  </svg>
);

const PauseCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="10" y1="15" x2="10" y2="9"></line>
      <line x1="14" y1="15" x2="14" y2="9"></line>
    </svg>
  );

const LoadingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
    </svg>
);


const talks = [
    {
        id: 1,
        title: "The Art of Letting Go",
        author: "Dr. Maya Vance",
        duration: "30s",
        category: "Anxiety",
        image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2000&auto=format&fit=crop",
        script: "Breathe in deeply. The art of letting go isn't about erasing the past, but accepting that the present is the only place where life exists. Imagine your worries as heavy stones in your backpack. You have carried them far enough. One by one, visualize yourself taking them out and setting them down by a quiet stream. Watch as the water flows around them. You are not your thoughts. You are the observer of your thoughts. You are safe, you are present, and you are free."
    },
    {
        id: 2,
        title: "Finding Focus in Chaos",
        author: "Prof. Andrew H.",
        duration: "45s",
        category: "Productivity",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2000&auto=format&fit=crop",
        script: "In a world of constant noise, focus is your superpower. It is not about forcing your mind to stay still, but gently bringing it back when it wanders. Think of your attention like a muscle. Every time you get distracted and choose to return to your task, you are doing a repetition. You are getting stronger. Do not judge the distraction. Acknowledge it, and let it drift away like a cloud in the sky. Your potential is vast. Center yourself, and begin again."
    },
    {
        id: 3,
        title: "You Are Enough",
        author: "Sarah Bliss",
        duration: "25s",
        category: "Self-Love",
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2000&auto=format&fit=crop",
        script: "Listen closely. There is nothing you need to achieve, buy, or become to be worthy of love. You are enough, exactly as you are right now. The pressure you feel is often a story you tell yourself. Rewire that story. Treat yourself with the same kindness you would offer a dear friend who is struggling. Your imperfections are not failures; they are what make you human. You are resilient, you are capable, and you are enough."
    },
    {
        id: 4,
        title: "Sleep Essentials",
        author: "Dr. Matthew W.",
        duration: "35s",
        category: "Sleep",
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=2000&auto=format&fit=crop",
        script: "Sleep is the foundation of your mental clarity. Tonight, give yourself permission to rest. Put away the screens and the to-do lists. They will be there tomorrow. Create a sanctuary of darkness and cool air. As you lie down, scan your body from head to toe, releasing tension in your jaw, your shoulders, your hands. You have done enough for today. Let the day go. Drift into the quiet. Rest is productive. Sleep well."
    }
];

// Helper to convert base64 to Uint8Array
const decodeBase64 = (base64: string): Uint8Array => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

// Helper to manually convert PCM data to AudioBuffer
const pcmToAudioBuffer = (data: Uint8Array, ctx: AudioContext): AudioBuffer => {
    const sampleRate = 24000; 
    const numChannels = 1;
    
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
             channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
};

const WisdomShorts: React.FC = () => {
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [loadingId, setLoadingId] = useState<number | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    const stopAudio = () => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
            } catch (e) {
                // ignore
            }
            sourceNodeRef.current = null;
        }
        setPlayingId(null);
    };

    const handlePlay = async (id: number, script: string) => {
        if (playingId === id) {
            stopAudio();
            return;
        }

        stopAudio();
        setLoadingId(id);

        try {
            if (!audioContextRef.current) {
                // @ts-ignore
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const base64Audio = await generateSpeech(script);
            const pcmBytes = decodeBase64(base64Audio);
            const audioBuffer = pcmToAudioBuffer(pcmBytes, audioContextRef.current);

            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => setPlayingId(null);
            source.start();
            
            sourceNodeRef.current = source;
            setPlayingId(id);

        } catch (error) {
            console.error("Failed to play wisdom audio:", error);
            alert("Could not play audio. Please try again.");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="py-8">
             <div className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h2 className="text-3xl font-bold text-white/90">Wisdom Shorts</h2>
                    <p className="text-white/60 mt-1">Tap to listen to 30-second counsels from experts</p>
                </div>
                <button className="text-sm text-[#A78BFA] hover:text-white transition-colors font-medium">View Library</button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {talks.map((talk) => (
                    <div 
                        key={talk.id} 
                        onClick={() => !loadingId && handlePlay(talk.id, talk.script)}
                        className="group relative aspect-[4/5] rounded-3xl overflow-hidden cursor-pointer shadow-lg transition-transform duration-300 hover:-translate-y-2"
                    >
                        <img 
                            src={talk.image} 
                            alt={talk.title} 
                            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 ${playingId === talk.id ? 'scale-105' : ''}`}
                        />
                        {/* Stronger gradient for better text visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent/10"></div>
                        
                        {/* Play Button Overlay */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${playingId === talk.id || loadingId === talk.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                             <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 hover:bg-white/30 transition-colors shadow-xl">
                                {loadingId === talk.id ? (
                                    <LoadingIcon className="w-8 h-8 text-white animate-spin" />
                                ) : playingId === talk.id ? (
                                    <PauseCircleIcon className="w-8 h-8 text-white" />
                                ) : (
                                    <PlayCircleIcon className="w-8 h-8 text-white ml-1" />
                                )}
                             </div>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6">
                             <span className="inline-block px-2.5 py-1 mb-3 text-[10px] font-bold text-white/90 bg-white/20 backdrop-blur-md rounded-md uppercase tracking-wide border border-white/10">
                                {talk.category}
                            </span>
                            <h3 className="text-xl font-bold text-white leading-tight mb-1 shadow-black drop-shadow-sm">{talk.title}</h3>
                            <p className="text-sm text-white/80">{talk.author}</p>
                            
                            <div className="mt-4 flex items-center text-xs text-white/60 font-medium">
                                {playingId === talk.id ? (
                                     <div className="flex space-x-1 items-center text-[#A78BFA]">
                                        <span className="w-1 h-3 bg-[#A78BFA] animate-[bounce_1s_infinite]"></span>
                                        <span className="w-1 h-4 bg-[#A78BFA] animate-[bounce_1.2s_infinite]"></span>
                                        <span className="w-1 h-2 bg-[#A78BFA] animate-[bounce_0.8s_infinite]"></span>
                                        <span className="ml-2 text-white">Playing...</span>
                                     </div>
                                ) : (
                                    <span className="opacity-80">{talk.duration}</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WisdomShorts;
