import React, { useState, useCallback, useMemo } from 'react';
import { ChakraUI, ChakraStatus, ChakraName } from '../types';
import { CHAKRA_DEFINITIONS } from '../constants';
// The Gemini service is no longer called directly from the dashboard
// import { analyzeMoodAndChakras } from '../services/geminiService';
import MoodTracker from './MoodTracker';
import ChakraCard from './ChakraCard';
import BreathingExercise from './BreathingExercise';
import MentalHealthScreening from './MentalHealthScreening';
import WisdomShorts from './WisdomShorts';
import FAQ from './FAQ';
import { RootChakraIcon, SacralChakraIcon, SolarPlexusChakraIcon, HeartChakraIcon, ThroatChakraIcon, ThirdEyeChakraIcon, CrownChakraIcon } from './icons/ChakraIcons';

// --- Icons for 'Feel Better' Section ---
const BandageIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2h4a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Z"/><path d="m8 16 8-8"/><path d="m8 8 8 8"/></svg>
);
const MoonIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);
const LeafIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>
);

const chakraIconMap: Record<ChakraName, React.FC<React.SVGProps<SVGSVGElement>>> = {
    [ChakraName.Root]: RootChakraIcon,
    [ChakraName.Sacral]: SacralChakraIcon,
    [ChakraName.SolarPlexus]: SolarPlexusChakraIcon,
    [ChakraName.Heart]: HeartChakraIcon,
    [ChakraName.Throat]: ThroatChakraIcon,
    [ChakraName.ThirdEye]: ThirdEyeChakraIcon,
    [ChakraName.Crown]: CrownChakraIcon,
};

const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col justify-center items-center p-12 h-64 bg-white/5 rounded-3xl backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA]"></div>
        <p className="mt-4 text-gray-200 font-medium">Harmonizing your energy...</p>
    </div>
);

const StudentDashboard: React.FC = () => {
    // Combine static definitions with dynamic status. Initially assume all Balanced.
    const [chakras, setChakras] = useState<ChakraUI[]>(() => 
        CHAKRA_DEFINITIONS.map(def => ({
            ...def,
            status: ChakraStatus.Balanced,
            recommendations: ["Maintain your current state of peace."],
            icon: chakraIconMap[def.name]
        }))
    );

    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [activeModal, setActiveModal] = useState<'none' | 'breathing' | 'screening'>('none');

    const handleMoodSubmit = useCallback(async (mood: number, journal: string) => {
        setIsLoading(true);
        setShowResults(true);
        try {
            // Call the new backend endpoint
            const response = await fetch('http://localhost:5001/api/moods/analyze', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mood, journal }),
            });

            if (!response.ok) {
              const errorBody = await response.text();
              throw new Error(`Backend request failed: ${response.status} ${errorBody}`);
            }

            const analysisResults = await response.json();
            
            // Merge backend data with UI definitions (colors, videos, icons)
            const mergedData: ChakraUI[] = CHAKRA_DEFINITIONS.map(def => {
                const analysis = analysisResults.find((r: any) => r.name === def.name);
                return {
                    ...def,
                    status: analysis ? analysis.status : ChakraStatus.Balanced,
                    recommendations: analysis ? analysis.recommendations : ["Analysis unavailable."],
                    icon: chakraIconMap[def.name]
                };
            });
            
            setChakras(mergedData);
        } catch (error) {
            console.error("Failed to fetch analysis from backend:", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="container mx-auto pb-24">
            {/* Sanskrit Hero Section */}
             <div className="text-center mb-20 animate-fade-in pt-12">
                <h1 className="text-5xl md:text-7xl font-medium text-gray-900 tracking-wide mb-6 header-font drop-shadow-sm">
                  लोकाः समस्ताः सुखिनो भवन्तु।
                </h1>
                <p className="text-xl text-gray-800 font-light italic tracking-wider opacity-80">
                  "Lokah Samastah Sukhino Bhavantu" <br/>
                  <span className="text-base not-italic mt-2 block opacity-70">May all beings everywhere be happy and free.</span>
                </p>
            </div>

            {/* "We're here to help you feel better" Section (Calm-inspired) */}
            <div className="mb-20 animate-fade-in-up">
                <h2 className="text-3xl font-bold text-center text-white/90 mb-12">We're here to help you feel better.</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Card 1 */}
                    <div onClick={() => setActiveModal('breathing')} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 group">
                        <div className="mb-6 p-4 bg-blue-50 rounded-2xl inline-block group-hover:bg-blue-100 transition-colors">
                            <BandageIcon />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Stress less.</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">Get in-the-moment relief for stress and anxiety so you can get back to living.</p>
                        <span className="text-blue-600 font-bold text-sm uppercase tracking-wide underline decoration-2 underline-offset-4">Start Breathing</span>
                    </div>

                    {/* Card 2 */}
                    <div onClick={() => window.scrollTo({ top: document.getElementById('wisdom-section')?.offsetTop, behavior: 'smooth' })} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 group">
                         <div className="mb-6 p-4 bg-purple-50 rounded-2xl inline-block group-hover:bg-purple-100 transition-colors">
                            <MoonIcon />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Sleep more.</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">Fall asleep (and stay asleep) naturally and peacefully with our wisdom.</p>
                        <span className="text-purple-600 font-bold text-sm uppercase tracking-wide underline decoration-2 underline-offset-4">Listen Now</span>
                    </div>

                    {/* Card 3 */}
                    <div onClick={() => setActiveModal('screening')} className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-1 group">
                         <div className="mb-6 p-4 bg-emerald-50 rounded-2xl inline-block group-hover:bg-emerald-100 transition-colors">
                            <LeafIcon />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-900 mb-3">Live mindfully.</h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">Navigate life's ups and downs with resilience, confidence, and guided support.</p>
                        <span className="text-emerald-600 font-bold text-sm uppercase tracking-wide underline decoration-2 underline-offset-4">Check In</span>
                    </div>
                </div>
            </div>

            {/* Modals */}
            {activeModal === 'breathing' && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-2xl glass-card rounded-3xl p-6 md:p-10 relative bg-[#1e1e2e]/90 border border-white/10 shadow-2xl">
                        <BreathingExercise onClose={() => setActiveModal('none')} />
                    </div>
                </div>
            )}

            {activeModal === 'screening' && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
                    <div className="w-full max-w-xl glass-card rounded-3xl p-8 relative bg-[#1e1e2e]/90 border border-white/10 shadow-2xl">
                         <button onClick={() => setActiveModal('none')} className="absolute top-6 right-6 text-white/50 hover:text-white">
                            {/* FIX: Corrected viewBox attribute in SVG element. The malformed attribute was causing the JSX parser to fail. */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                        <MentalHealthScreening onComplete={() => setActiveModal('none')} />
                    </div>
                </div>
            )}

            {/* Main Mood Tracker */}
            <div className="glass-card rounded-3xl p-8 md:p-12 max-w-4xl mx-auto mb-24 animate-fade-in-up bg-black/30 border border-white/10 backdrop-blur-xl" style={{ animationDelay: '200ms' }}>
                <MoodTracker onSubmit={handleMoodSubmit} isLoading={isLoading} />
            </div>

             {/* Chakra Analysis Results - Video Cards */}
            <div className={`transition-all duration-1000 ease-in-out ${showResults ? 'opacity-100 max-h-[5000px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
                {showResults && (
                    <div className="mb-24">
                        <h2 className="text-4xl font-bold text-center text-white mb-12">Energy Analysis</h2>
                        {isLoading ? (
                            <LoadingSpinner />
                        ) : (
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-4">
                                {chakras.map((chakra, index) => (
                                    <ChakraCard key={index} chakra={chakra} index={index} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Wisdom Shorts Section */}
            <div id="wisdom-section" className="mb-24 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                 <WisdomShorts />
            </div>

            {/* FAQ Section */}
            <div className="animate-fade-in-up max-w-4xl mx-auto" style={{ animationDelay: '400ms' }}>
                <FAQ />
            </div>
        </div>
    );
};

export default StudentDashboard;