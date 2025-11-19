
import React from 'react';
import { UserRole, User, View } from '../types';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  currentView: View;
  onViewChange: (view: View) => void;
}

const LogoutIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const NavLink: React.FC<{ text: string; isActive: boolean; onClick: () => void }> = ({ text, isActive, onClick }) => (
    <button 
        onClick={onClick} 
        className={`px-5 py-2 text-sm font-medium transition-all rounded-full ${
            isActive 
            ? 'bg-white/20 text-white shadow-sm backdrop-blur-md border border-white/10' 
            : 'text-white/70 hover:text-white hover:bg-white/10'
        }`}
    >
        {text}
    </button>
);

const Header: React.FC<HeaderProps> = ({ user, onLogout, currentView, onViewChange }) => {
  const isStudent = user.role === UserRole.Student;

  return (
    <header className="fixed top-0 left-0 right-0 z-30 p-6 transition-all duration-300">
      <div className="container mx-auto flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white header-font tracking-tight">Satva</h1>
          </div>
          
           {isStudent && (
            <nav className="hidden md:flex items-center absolute left-1/2 -translate-x-1/2 bg-black/30 backdrop-blur-xl rounded-full p-1.5 border border-white/10 shadow-lg">
                <NavLink text="Dashboard" isActive={currentView === 'dashboard'} onClick={() => onViewChange('dashboard')} />
                <NavLink text="Meditate" isActive={currentView === 'meditate'} onClick={() => onViewChange('meditate')} />
                <NavLink text="Learn" isActive={currentView === 'modules'} onClick={() => onViewChange('modules')} />
                <NavLink text="Journal" isActive={currentView === 'journal'} onClick={() => onViewChange('journal')} />
            </nav>
            )}

          <div className="flex items-center space-x-4">
                <button 
                    onClick={onLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-semibold transition-colors bg-white/80 text-gray-900 hover:bg-white shadow-sm backdrop-blur-sm"
                    aria-label="Logout"
                >
                    <LogoutIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Log out</span>
              </button>
          </div>
        </div>
    </header>
  );
};

export default Header;
