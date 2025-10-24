import React, { useState, useCallback } from 'react';
import { Chakra } from '../types';
import { INITIAL_CHAKRA_STATE } from '../constants';
import { analyzeMoodAndChakras } from '../services/geminiService';
import MoodTracker from './MoodTracker';
import ChakraCard from './ChakraCard';

const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A78BFA]"></div>
    </div>
);

const StudentDashboard: React.FC = () => {
    const [chakras, setChakras] = useState<Chakra[]>(INITIAL_CHAKRA_STATE);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const handleMoodSubmit = useCallback(async (mood: number, journal: string) => {
        setIsLoading(true);
        setShowResults(true);
        try {
            const results = await analyzeMoodAndChakras({ mood, journal });
            setChakras(results);
        } catch (error) {
            console.error("Failed to analyze mood:", error);
            // Optionally, set an error state to show in the UI
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="container mx-auto">
            <MoodTracker onSubmit={handleMoodSubmit} isLoading={isLoading} />

            {showResults && (
                <div className="mt-12">
                    <h2 className="text-3xl font-bold text-center text-white/90 mb-8">Your Chakra Analysis</h2>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {chakras.map((chakra, index) => (
                                <ChakraCard key={index} chakra={chakra} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;