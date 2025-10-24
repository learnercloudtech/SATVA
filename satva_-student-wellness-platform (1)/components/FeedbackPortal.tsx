import React, { useState } from 'react';
import { submitFeedback } from '../services/geminiService';

const Toast: React.FC<{ message: string; show: boolean; onClose: () => void }> = ({ message, show, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg flex items-center animate-fade-in-up">
            <span>{message}</span>
            <button onClick={onClose} className="ml-4 text-xl font-bold">&times;</button>
        </div>
    );
};

const FeedbackPortal: React.FC = () => {
    const [feedback, setFeedback] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (feedback.trim() === '') return;
        setIsSubmitting(true);

        try {
            await submitFeedback(feedback);
            
            setFeedback('');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 4000);
        } catch (error) {
            console.error("Failed to submit feedback:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto mt-4">
                <div className="glass-card p-8 rounded-2xl">
                    <h2 className="text-3xl font-bold text-white/90 text-center">Anonymous Feedback Portal</h2>
                    <p className="text-center text-white/60 mt-2 mb-8">Your voice is important. Share your thoughts, concerns, or suggestions with educators. Your submission is 100% anonymous.</p>
                    <form onSubmit={handleSubmit}>
                        <textarea
                            rows={8}
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Type your feedback here..."
                            className="w-full p-4 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white/90 placeholder-white/40"
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full mt-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300 disabled:bg-gray-500 disabled:from-gray-500 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Submitting...
                                </>
                            ) : (
                                'Submit Anonymously'
                            )}
                        </button>
                    </form>
                </div>
            </div>
            <Toast message="Feedback sent successfully!" show={showToast} onClose={() => setShowToast(false)} />
        </>
    );
};

export default FeedbackPortal;