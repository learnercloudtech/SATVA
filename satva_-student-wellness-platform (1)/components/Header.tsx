import React from 'react';
import { UserRole } from '../types';
import { User } from '../App';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentView: string;
  onViewChange: (view: 'dashboard' | 'feedback' | 'modules') => void;
}

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.25.43 2.4 1.16 3.32A6.51 6.51 0 0 0 12 22a6.51 6.51 0 0 0 3.34-12.18c.73-.92 1.16-2.07 1.16-3.32A4.5 4.5 0 0 0 12 2z" />
    <path d="M12 2v4.5" />
    <path d="M2.5 10.5c0-2.3 1.54-4.25 3.65-4.9" />
    <path d="M21.5 10.5c0-2.3-1.54-4.25-3.65-4.9" />
    <path d="M4.34 14.5a2.5 2.5 0 0 1 0-5" />
    <path d="M19.66 14.5a2.5 2.5 0 0 0 0-5" />
    <path d="M12 14.35a2.5 2.5 0 0 0 3-4.1" />
    <path d="M12 14.35a2.5 2.5 0 0 1-3-4.1" />
    <path d="M12 22v-7.65" />
  </svg>
);

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, onViewChange }) => {
  const isStudent = user.role === UserRole.Student;

  return (
    <header className="sticky top-0 z-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-3">
            <BrainIcon className="h-8 w-8 text-white/90" />
            <h1 className="text-3xl font-bold text-white">Satva</h1>
          </div>
          
          <div className="flex items-center space-x-6">
            {isStudent && (
              <nav className="hidden md:flex items-center space-x-8">
                <button onClick={() => onViewChange('dashboard')} className={`text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'text-white border-b-2 border-white/80' : 'text-white/60 hover:text-white'}`}>Dashboard</button>
                <button onClick={() => onViewChange('modules')} className={`text-sm font-medium transition-colors ${currentView === 'modules' ? 'text-white border-b-2 border-white/80' : 'text-white/60 hover:text-white'}`}>Modules</button>
                <button onClick={() => onViewChange('feedback')} className={`text-sm font-medium transition-colors ${currentView === 'feedback' ? 'text-white border-b-2 border-white/80' : 'text-white/60 hover:text-white'}`}>Feedback</button>
              </nav>
            )}

            <div className="flex items-center space-x-4">
                <span className="hidden sm:inline text-sm font-medium text-white/70">
                    Welcome, <span className="font-semibold text-white">{user.name}</span>
                </span>
                 <button 
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-semibold transition-colors bg-white/10 text-white/80 hover:bg-white/20"
                    aria-label="Logout"
                >
                    <LogoutIcon className="h-4 w-4" />
                    <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
        {isStudent && (
          <nav className="md:hidden flex items-center justify-around bg-black/20 p-1 rounded-full my-2">
            <button onClick={() => onViewChange('dashboard')} className={`flex-1 py-2 text-center rounded-full text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-white/10 text-white shadow' : 'text-white/70'}`}>Dashboard</button>
            <button onClick={() => onViewChange('modules')} className={`flex-1 py-2 text-center rounded-full text-sm font-medium transition-colors ${currentView === 'modules' ? 'bg-white/10 text-white shadow' : 'text-white/70'}`}>Modules</button>
            <button onClick={() => onViewChange('feedback')} className={`flex-1 py-2 text-center rounded-full text-sm font-medium transition-colors ${currentView === 'feedback' ? 'bg-white/10 text-white shadow' : 'text-white/70'}`}>Feedback</button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;