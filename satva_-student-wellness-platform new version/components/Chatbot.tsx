
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import type { Chat } from '@google/genai';
import { View } from '../types';

// --- Icons ---
const ChatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
);

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const SendIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
);

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

interface ChatbotProps {
  currentView: View;
}

const Chatbot: React.FC<ChatbotProps> = ({ currentView }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "Hello! I'm Satva, your wellness assistant. How can I support you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeChat = () => {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                chatRef.current = ai.chats.create({
                    model: 'gemini-flash-lite-latest',
                    config: {
                        systemInstruction: `You are Satva, a friendly and empathetic AI wellness assistant for a student wellness app. Your purpose is to support students on their journey. You are knowledgeable about chakras, mindfulness, and well-being.
                        
                        IMPORTANT: You will receive the user's current location in the app as a context hint in brackets, like [User is on the 'modules' page]. Use this hint to tailor your response. For example, if the user is on the 'modules' page and asks for help, offer assistance related to the learning modules. If they are on the 'dashboard', focus on their mood and chakra analysis.
                        
                        Always provide supportive, encouraging, and actionable advice. Do NOT provide medical diagnoses. Keep responses concise.`,
                    },
                });
            } catch (error) {
                console.error("Failed to initialize Gemini Chat:", error);
                setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
            }
        };
        initializeChat();
    }, []);
    
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            if (!chatRef.current) {
                 throw new Error("Chat is not initialized.");
            }
            // Add context to the user's prompt
            const contextualPrompt = `[User is on the '${currentView}' page] ${input}`;
            
            const response = await chatRef.current.sendMessage({ message: contextualPrompt });
            const aiMessage: Message = { sender: 'ai', text: response.text || "I'm here." };
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            const errorMessage: Message = { sender: 'ai', text: "I'm sorry, I encountered an error. Could you please try again?" };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100 scale-100'}`}>
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                    aria-label="Open chatbot"
                >
                    <ChatIcon className="w-8 h-8" />
                </button>
            </div>

            <div className={`fixed bottom-6 right-6 z-50 w-[calc(100%-3rem)] max-w-sm h-[70vh] max-h-[500px] flex flex-col glass-card rounded-2xl shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'}`}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white">Satva AI Assistant</h3>
                    <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white" aria-label="Close chatbot">
                        <CloseIcon className="w-6 h-6" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-br-none' : 'bg-black/20 text-white/90 rounded-bl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                             <div className="flex justify-start">
                                <div className="max-w-[80%] p-3 rounded-2xl bg-black/20 text-white/90 rounded-bl-none">
                                    <div className="flex items-center space-x-1">
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-0"></span>
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-150"></span>
                                        <span className="w-2 h-2 bg-white/50 rounded-full animate-bounce delay-300"></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/10 flex-shrink-0">
                    <form onSubmit={handleSend} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask me anything..."
                            className="flex-1 p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white/90 placeholder-white/40"
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className="w-12 h-12 bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-lg flex items-center justify-center transition-opacity disabled:opacity-50"
                        >
                            <SendIcon className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Chatbot;
