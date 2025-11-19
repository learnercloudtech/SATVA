
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GoogleGenAI, Modality } from '@google/genai';
import type { LiveServerMessage, Blob as GenAIBlob } from '@google/genai';

// --- Audio & Base64 Utilities ---
function encode(bytes: Uint8Array): string {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
  
function decode(base64: string): Uint8Array {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}
  
async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
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
}

function createBlob(data: Float32Array): GenAIBlob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      // Convert float32 to int16 with clamping
      let s = Math.max(-1, Math.min(1, data[i]));
      int16[i] = s < 0 ? s * 32768 : s * 32767;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
}

// --- Icons ---
const MicIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line></svg>
);
const StopIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="6" y="6" width="12" height="12"></rect></svg>
);
const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

interface Transcription {
    speaker: 'user' | 'ai';
    text: string;
}

const LiveChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [status, setStatus] = useState<'idle' | 'initializing' | 'connecting' | 'listening' | 'speaking'>('idle');
    const [statusMessage, setStatusMessage] = useState('');
    const [transcriptionHistory, setTranscriptionHistory] = useState<Transcription[]>([]);
    const [error, setError] = useState<string | null>(null);
    
    const aiRef = useRef<GoogleGenAI | null>(null);
    const activeSessionRef = useRef<any | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const nextStartTimeRef = useRef<number>(0);
    const connectionTimeoutRef = useRef<number | null>(null);

    const currentInputTranscription = useRef('');
    const currentOutputTranscription = useRef('');
    
    const transcriptEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        aiRef.current = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }, []);

    useEffect(() => {
        transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [transcriptionHistory, status]);

    const handleStop = useCallback(async () => {
        if (connectionTimeoutRef.current) {
            clearTimeout(connectionTimeoutRef.current);
            connectionTimeoutRef.current = null;
        }

        if (status === 'idle') return;
        setStatus('idle');
        setStatusMessage('');

        if (activeSessionRef.current) {
            try {
                activeSessionRef.current.close();
            } catch (e) {
                console.warn("Error closing session:", e);
            }
            activeSessionRef.current = null;
        }

        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
        }

        for (const source of sourcesRef.current.values()) {
            source.stop();
        }
        sourcesRef.current.clear();
        nextStartTimeRef.current = 0;
    }, [status]);


    const handleStart = async () => {
        if (status !== 'idle' || !aiRef.current) return;
        
        setStatus('initializing');
        setStatusMessage('Acquiring microphone access...');
        setTranscriptionHistory([]);
        setError(null);

        connectionTimeoutRef.current = window.setTimeout(() => {
            setError("Connection timed out. Please check your internet connection.");
            handleStop();
        }, 15000);

        try {
            streamRef.current = await navigator.mediaDevices.getUserMedia({ 
                audio: { 
                    sampleRate: 16000, 
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                } 
            });
            
            setStatusMessage('Setting up audio stream...');
            // @ts-ignore 
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            inputAudioContextRef.current = new AudioContextClass({ sampleRate: 16000 });
            outputAudioContextRef.current = new AudioContextClass({ sampleRate: 24000 });

            await inputAudioContextRef.current.resume();
            await outputAudioContextRef.current.resume();

            setStatusMessage('Connecting to Satva AI...');
            
            const session = await aiRef.current.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
                        
                        if (!inputAudioContextRef.current || !streamRef.current) return;
                        
                        setStatus('listening');
                        setStatusMessage('Listening...');
                        
                        const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
                        scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);
                        
                        scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                            if (!activeSessionRef.current) return;

                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob = createBlob(inputData);
                            
                            try {
                                activeSessionRef.current.sendRealtimeInput({ media: pcmBlob });
                            } catch (e) {
                                console.error("Error sending audio data:", e);
                            }
                        };
                        
                        source.connect(scriptProcessorRef.current);
                        scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            setStatus('speaking');
                            
                            const outputAudioContext = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputAudioContext.currentTime);
                            
                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
                            
                            const sourceNode = outputAudioContext.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            sourceNode.connect(outputAudioContext.destination);
                            
                            sourceNode.addEventListener('ended', () => {
                                sourcesRef.current.delete(sourceNode);
                                if (sourcesRef.current.size === 0 && status !== 'idle') {
                                    setStatus('listening');
                                }
                            });

                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(sourceNode);
                        }
                        
                        if (message.serverContent?.interrupted) {
                            for (const source of sourcesRef.current.values()) {
                                source.stop();
                            }
                            sourcesRef.current.clear();
                            nextStartTimeRef.current = 0;
                            setStatus('listening');
                        }

                        if (message.serverContent?.inputTranscription) {
                            currentInputTranscription.current += message.serverContent.inputTranscription.text;
                        }
                        if (message.serverContent?.outputTranscription) {
                            currentOutputTranscription.current += message.serverContent.outputTranscription.text;
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputTranscription.current.trim();
                            const fullOutput = currentOutputTranscription.current.trim();
                            if (fullInput) setTranscriptionHistory(prev => [...prev, { speaker: 'user', text: fullInput }]);
                            if (fullOutput) setTranscriptionHistory(prev => [...prev, { speaker: 'ai', text: fullOutput }]);
                            currentInputTranscription.current = '';
                            currentOutputTranscription.current = '';
                            setStatus('listening');
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live API Error:', e);
                        setError('Connection interrupted.');
                        handleStop();
                    },
                    onclose: (e: CloseEvent) => {
                        console.log('Session closed');
                        handleStop();
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } },
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                    systemInstruction: 'You are Satva, a kind and patient mental wellness counselor for students. Keep your answers concise, warm, and supportive. Do not give medical advice.',
                },
            });
            
            activeSessionRef.current = session;

        } catch (err) {
            console.error("Failed to start audio session:", err);
            if (connectionTimeoutRef.current) clearTimeout(connectionTimeoutRef.current);
            
            let errorMessage = 'Could not connect. Please check permissions.';
            if (err instanceof Error) {
                if (err.name === 'NotAllowedError') errorMessage = 'Microphone access denied. Please allow permissions.';
                if (err.name === 'NotFoundError') errorMessage = 'No microphone found.';
                if (err.message.includes('403')) errorMessage = 'API Key invalid or access denied.';
            }
            setError(errorMessage);
            handleStop();
        }
    };
    
    useEffect(() => { return () => { handleStop(); }; }, [handleStop]);

    return (
        <>
            <div className={`fixed bottom-28 right-6 z-40 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button onClick={() => setIsOpen(true)} className="w-16 h-16 bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform" aria-label="Open live chat"><MicIcon className="w-8 h-8" /></button>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[600px] flex flex-col glass-card rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white">Live Conversation</h3>
                    <button onClick={() => { setIsOpen(false); handleStop(); }} className="text-white/70 hover:text-white" aria-label="Close live chat"><CloseIcon className="w-6 h-6" /></button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {transcriptionHistory.map((entry, index) => (
                            <div key={index} className={`flex ${entry.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${entry.speaker === 'user' ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white rounded-br-none' : 'bg-black/20 text-white/90 rounded-bl-none'}`}>
                                    {entry.text}
                                </div>
                            </div>
                        ))}
                         {transcriptionHistory.length === 0 && !error && status === 'idle' && (
                            <div className="text-center text-white/60 pt-8">
                                <MicIcon className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                                <p>Press "Start" to begin a voice conversation.</p>
                            </div>
                        )}
                        {status !== 'idle' && status !== 'listening' && status !== 'speaking' && (
                             <div className="flex justify-center pt-4">
                                 <div className="flex items-center space-x-2 text-sky-300 bg-sky-500/10 px-4 py-2 rounded-full">
                                     <div className="w-2 h-2 bg-sky-300 rounded-full animate-pulse"></div>
                                     <span className="text-sm">{statusMessage}</span>
                                 </div>
                             </div>
                        )}
                        {status === 'listening' && (
                             <div className="flex justify-center pt-4">
                                <div className="text-xs text-white/40 uppercase tracking-widest">Listening...</div>
                             </div>
                        )}
                        {status === 'speaking' && (
                             <div className="flex justify-center pt-4">
                                <div className="text-xs text-[#A78BFA] uppercase tracking-widest animate-pulse">Satva is speaking...</div>
                             </div>
                        )}
                        <div ref={transcriptEndRef} />
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 flex-shrink-0 text-center">
                    {error && (
                         <div className="mb-3 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 text-left" role="alert">
                            <p className="font-bold">Connection Error</p>
                            <p className="mt-1">{error}</p>
                        </div>
                    )}
                    {status === 'idle' ? (
                        <button onClick={handleStart} className="w-full bg-gradient-to-r from-sky-500 to-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:from-sky-600 hover:to-blue-600 flex items-center justify-center space-x-2 transition-all"><MicIcon /><span>Start Conversation</span></button>
                    ) : (
                        <button onClick={handleStop} className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-3 px-4 rounded-lg hover:from-red-600 hover:to-pink-600 flex items-center justify-center space-x-2 transition-all"><StopIcon /><span>Stop Conversation</span></button>
                    )}
                </div>
            </div>
        </>
    );
};

export default LiveChat;
