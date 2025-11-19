import React, { useState } from 'react';

const questions = [
    { id: 1, text: "Over the last 2 weeks, have you felt nervous, anxious, or on edge?" },
    { id: 2, text: "Have you not been able to stop or control worrying?" },
    { id: 3, text: "Have you had little interest or pleasure in doing things?" },
    { id: 4, text: "Have you felt down, depressed, or hopeless?" }
];

const options = [
    { value: 0, label: "Not at all" },
    { value: 1, label: "Several days" },
    { value: 2, label: "More than half the days" },
    { value: 3, label: "Nearly every day" }
];

const MentalHealthScreening: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [scores, setScores] = useState<number[]>([]);
    const [result, setResult] = useState<'none' | 'check-in' | 'support'>('none');
    const [isFinished, setIsFinished] = useState(false);

    const handleAnswer = (value: number) => {
        const newScores = [...scores, value];
        setScores(newScores);

        if (currentStep < questions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const calculateResult = (finalScores: number[]) => {
        const total = finalScores.reduce((a, b) => a + b, 0);
        if (total >= 6) setResult('support');
        else if (total >= 3) setResult('check-in');
        else setResult('none');
        setIsFinished(true);
    };

    if (isFinished) {
        return (
            <div className="text-center py-6 animate-fade-in">
                <div className="mb-6">
                    {result === 'support' && (
                        <div className="bg-red-500/20 border border-red-500/30 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-red-200 mb-2">We hear you.</h3>
                            <p className="text-white/80">Your responses suggest you might be carrying a heavy load right now. It's okay to ask for help.</p>
                            <button onClick={onComplete} className="mt-4 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full transition-colors">Connect with a Counselor</button>
                        </div>
                    )}
                    {result === 'check-in' && (
                        <div className="bg-yellow-500/20 border border-yellow-500/30 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-yellow-200 mb-2">A gentle nudge.</h3>
                            <p className="text-white/80">You seem a bit stressed. Try our "3-Minute Calm" exercises or write in your journal today.</p>
                             <button onClick={onComplete} className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-2 rounded-full transition-colors">Explore Tools</button>
                        </div>
                    )}
                    {result === 'none' && (
                        <div className="bg-green-500/20 border border-green-500/30 p-6 rounded-2xl">
                            <h3 className="text-xl font-bold text-green-200 mb-2">You're doing well!</h3>
                            <p className="text-white/80">Keep up your wellness practices. Regular check-ins help maintain this balance.</p>
                             <button onClick={onComplete} className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors">Back to Dashboard</button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const question = questions[currentStep];

    return (
        <div className="py-4">
            <div className="mb-8">
                <div className="flex justify-between text-xs text-white/40 mb-2 uppercase tracking-wider">
                    <span>Question {currentStep + 1} of {questions.length}</span>
                    <span>Mental Health Check</span>
                </div>
                <div className="w-full bg-white/10 h-1 rounded-full">
                    <div className="bg-[#A78BFA] h-1 rounded-full transition-all duration-300" style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}></div>
                </div>
            </div>

            <h3 className="text-xl md:text-2xl font-medium text-white mb-8 leading-relaxed">
                {question.text}
            </h3>

            <div className="space-y-3">
                {options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleAnswer(opt.value)}
                        className="w-full text-left p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all duration-200 flex items-center group"
                    >
                        <div className="w-6 h-6 rounded-full border-2 border-white/30 group-hover:border-[#A78BFA] mr-4 flex-shrink-0"></div>
                        <span className="text-white/80 group-hover:text-white">{opt.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MentalHealthScreening;