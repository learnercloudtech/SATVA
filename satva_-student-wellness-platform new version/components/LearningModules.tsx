import React from 'react';

interface Module {
  title: string;
  description: string;
  progress: number;
  unlocked: boolean;
  badge?: string;
}

const modules: Module[] = [
  {
    title: 'Mindful Breathing Basics',
    description: 'Learn foundational breathing techniques to calm your mind and reduce stress in minutes.',
    progress: 100,
    unlocked: true,
    badge: 'Zen Beginner'
  },
  {
    title: 'Understanding Your Chakras',
    description: 'An introduction to the seven chakras and how they influence your emotional and physical well-being.',
    progress: 75,
    unlocked: true,
  },
  {
    title: 'Cognitive Restructuring',
    description: 'Identify and challenge negative thought patterns to build a more positive outlook.',
    progress: 20,
    unlocked: true,
  },
  {
    title: 'Advanced Meditation Techniques',
    description: 'Deepen your practice with guided meditations for focus, compassion, and insight.',
    progress: 0,
    unlocked: false,
  },
];

const LockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const BadgeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);


const LearningModules: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-white/90 mb-8 text-center">Your Wellness Journey</h2>
      <div className="space-y-6">
        {modules.map((module, index) => (
          <div key={index} className={`glass-card rounded-2xl transition-all duration-300 ${!module.unlocked ? 'opacity-60' : 'hover:bg-white/10'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white/90">{module.title}</h3>
                  <p className="text-white/60 mt-1">{module.description}</p>
                </div>
                {!module.unlocked && <LockIcon className="text-white/40 w-7 h-7 flex-shrink-0 ml-4" />}
              </div>
              
              {module.unlocked && (
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-white/70">Progress</span>
                     {module.badge && (
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-500/20 text-pink-300">
                         <BadgeIcon className="w-4 h-4 mr-1.5"/>
                         {module.badge}
                       </span>
                    )}
                  </div>
                  <div className="w-full bg-black/20 rounded-full h-2.5">
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-2.5 rounded-full" style={{ width: `${module.progress}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearningModules;