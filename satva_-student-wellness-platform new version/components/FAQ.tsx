import React, { useState } from 'react';

const ChevronDownIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const faqData = [
    {
        question: "What is Satva?",
        answer: "Satva is a comprehensive wellness platform designed for students. We combine ancient yogic wisdom (Chakras) with modern psychological tools to help you track your mood, manage stress, and find balance."
    },
    {
        question: "Is my data private?",
        answer: "Yes, absolutely. Your journal entries and mood logs are private. When you submit feedback to educators, it is anonymized to ensure you can speak freely without fear of judgment."
    },
    {
        question: "How often should I use the mood tracker?",
        answer: "We recommend checking in once a day. Building a habit of self-reflection helps you identify patterns in your emotional well-being and catch signs of burnout early."
    },
    {
        question: "What if I feel overwhelmed?",
        answer: "Satva offers 'Quick Relief' tools like breathing exercises and short meditations. If you feel unsafe or in crisis, please use the 'Get Help' button to access professional resources immediately."
    }
];

const FAQ: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="max-w-3xl mx-auto py-12">
            <h2 className="text-3xl font-bold text-white/90 text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-4">
                {faqData.map((item, index) => (
                    <div key={index} className="glass-card rounded-xl overflow-hidden">
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className="w-full px-6 py-4 flex justify-between items-center text-left text-white/90 font-medium hover:bg-white/5 transition-colors"
                        >
                            <span>{item.question}</span>
                            <ChevronDownIcon className={`transform transition-transform duration-300 text-white/50 ${openIndex === index ? 'rotate-180' : ''}`} />
                        </button>
                        <div
                            className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed">
                                {item.answer}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;