import React, { useState } from 'react';
import { UserRole } from '../types';

interface AuthPageProps {
  onLogin: (name: string, role: UserRole) => void;
}

type AuthMode = 'login' | 'signup';

const BrainIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M12 2a4.5 4.5 0 0 0-4.5 4.5c0 1.25.43 2.4 1.16 3.32A6.51 6.51 0 0 0 12 22a6.51 6.51 0 0 0 3.34-12.18c.73-.92 1.16-2.07 1.16-3.32A4.5 4.5 0 0 0 12 2z" />
      <path d="M12 2v4.5" />
      <path d="M2.5 10.5c0-2.3 1.54-4.25 3.65-4.9" />
      <path d="M21.5 10.5c0-2.3-1.54-4.25-3.65-4.9" />
    </svg>
);

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [role, setRole] = useState<UserRole>(UserRole.Student);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loginName = authMode === 'signup' ? name : (email.split('@')[0] || 'User');
    onLogin(loginName, role);
  };

  const isStudent = role === UserRole.Student;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-2">
                <BrainIcon className="h-10 w-10 text-white/90" />
                <h1 className="text-5xl font-bold text-white">Satva</h1>
            </div>
            <p className="text-white/60">Your journey to mental wellness starts here.</p>
        </div>

        <div className="glass-card rounded-2xl p-8">
            <div className="mb-6">
                <div className="flex items-center space-x-2 bg-black/20 p-1 rounded-full">
                    <button 
                        onClick={() => setRole(UserRole.Student)}
                        className={`w-full py-2 rounded-full text-sm font-semibold transition-all ${isStudent ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        I'm a Student
                    </button>
                    <button 
                        onClick={() => setRole(UserRole.Educator)}
                        className={`w-full py-2 rounded-full text-sm font-semibold transition-all ${!isStudent ? 'bg-white/10 text-white' : 'text-white/50 hover:bg-white/5'}`}
                    >
                        I'm an Educator
                    </button>
                </div>
            </div>

            <div className="flex mb-6">
                 <button onClick={() => setAuthMode('login')} className={`flex-1 py-2 text-sm font-medium transition-colors ${authMode === 'login' ? 'text-white border-b-2 border-white/80' : 'text-white/50'}`}>
                    Login
                </button>
                 <button onClick={() => setAuthMode('signup')} className={`flex-1 py-2 text-sm font-medium transition-colors ${authMode === 'signup' ? 'text-white border-b-2 border-white/80' : 'text-white/50'}`}>
                    Sign Up
                </button>
            </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white/70 mb-1">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  required
                  className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white/90 placeholder-white/40"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white/90 placeholder-white/40"
              />
            </div>
            <div>
                <label htmlFor="password"className="block text-sm font-medium text-white/70 mb-1">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full p-3 bg-black/20 border border-white/10 rounded-lg focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white/90 placeholder-white/40"
                />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:from-violet-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition-all duration-300"
            >
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;