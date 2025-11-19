
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

const GoogleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
            <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
            <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.479 L -25.464 53.479 L -25.464 56.569 C -23.494 60.479 -19.464 63.239 -14.754 63.239 Z" />
            <path fill="#FBBC05" d="M -21.484 53.479 C -21.734 52.719 -21.864 51.919 -21.864 51.119 C -21.864 50.319 -21.734 49.519 -21.484 48.759 L -21.484 45.669 L -25.464 45.669 C -26.274 47.289 -26.734 49.149 -26.734 51.119 C -26.734 53.089 -26.274 54.949 -25.464 56.569 L -21.484 53.479 Z" />
            <path fill="#EA4335" d="M -14.754 43.739 C -12.984 43.739 -11.404 44.349 -10.154 45.549 L -6.904 42.299 C -8.884 40.439 -11.514 38.989 -14.754 38.989 C -19.464 38.989 -23.494 41.749 -25.464 45.669 L -21.484 48.759 C -20.534 45.859 -17.884 43.739 -14.754 43.739 Z" />
        </g>
    </svg>
);

const AppleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-.98-.42-2.08-.42-3.12 0-1.05.48-2.08.55-3.05-.4C5.6 18.1 4 14.5 4 11.5c0-3.5 2.5-5.5 5-5.5 1.1 0 2 .5 2.5 1 .5-.5 1.4-1 2.5-1 2.5 0 4.5 2 5 4.5-2.5 1-3 5 .5 6.5-.5 1.5-1.5 3-2.45 4.28zM12.05 3c0 1.5-1 2.5-2.5 3-.5-2 1.5-3.5 2.5-3z"/>
    </svg>
);

const FacebookIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
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

  const handleSocialLogin = (provider: string) => {
    const loginName = provider === 'Google' ? 'Alex' : provider === 'Facebook' ? 'Taylor' : 'Jordan';
    onLogin(loginName, role);
  };

  const isStudent = role === UserRole.Student;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-16 md:pt-4">
      <div className="w-full max-w-md">
        
        {/* Brand Header */}
        <div className="text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-2">
                <BrainIcon className="h-12 w-12 text-white/90" />
                <h1 className="text-5xl font-bold text-white header-font">Satva</h1>
            </div>
            <p className="text-white/60 text-lg font-light">Balance your energy, elevate your mind.</p>
        </div>

        <div className="glass-card rounded-3xl p-8 md:p-10 shadow-2xl animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            
            {/* Header Title */}
            <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-white">
                    {authMode === 'login' ? 'Welcome Back' : 'Create your account'}
                </h2>
                <p className="text-sm text-white/50 mt-1">
                     Please enter your details.
                </p>
            </div>

            {/* Role Selection Segmented Control */}
            <div className="mb-8 p-1 bg-black/30 rounded-xl flex">
                <button 
                    onClick={() => setRole(UserRole.Student)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${isStudent ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                >
                    Student
                </button>
                <button 
                    onClick={() => setRole(UserRole.Educator)}
                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${!isStudent ? 'bg-white/20 text-white shadow-sm' : 'text-white/40 hover:text-white/70'}`}
                >
                    Educator
                </button>
            </div>

            {/* Social Logins */}
            <div className="space-y-3 mb-8">
                <button 
                    onClick={() => handleSocialLogin('Google')}
                    className="w-full flex items-center justify-center bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-xl transition-colors shadow-md group"
                >
                    <GoogleIcon className="h-5 w-5 mr-3" />
                    <span>Continue with Google</span>
                </button>
                <button 
                    onClick={() => handleSocialLogin('Facebook')}
                    className="w-full flex items-center justify-center bg-[#1877F2] hover:bg-[#166fe5] text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md"
                >
                    <FacebookIcon className="h-5 w-5 mr-3 fill-white" />
                    <span>Continue with Facebook</span>
                </button>
                <button 
                    onClick={() => handleSocialLogin('Apple')}
                    className="w-full flex items-center justify-center bg-black hover:bg-gray-900 text-white font-semibold py-3 px-4 rounded-xl transition-colors shadow-md border border-white/10"
                >
                    <AppleIcon className="h-5 w-5 mr-3" />
                    <span>Continue with Apple</span>
                </button>
            </div>

            {/* Divider */}
            <div className="flex items-center mb-8">
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <span className="mx-4 text-xs font-medium text-white/40 uppercase tracking-wider">OR</span>
                <div className="flex-grow h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
                {authMode === 'signup' && (
                <div className="space-y-1">
                    <label htmlFor="name" className="block text-xs font-medium text-white/60 ml-1">Full Name</label>
                    <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white placeholder-white/30 outline-none"
                    />
                </div>
                )}
                <div className="space-y-1">
                    <label htmlFor="email" className="block text-xs font-medium text-white/60 ml-1">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white placeholder-white/30 outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label htmlFor="password"className="block text-xs font-medium text-white/60 ml-1">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl focus:ring-2 focus:ring-[#A78BFA] focus:border-[#A78BFA] transition-colors text-white placeholder-white/30 outline-none"
                    />
                </div>
                
                {authMode === 'login' && (
                    <div className="flex justify-end">
                        <button type="button" className="text-xs text-[#A78BFA] hover:text-[#C4B5FD] font-medium transition-colors">
                            Forgot password?
                        </button>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-purple-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-purple-500 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                {authMode === 'login' ? 'Log In' : 'Create Account'}
                </button>
            </form>

             {/* Footer Toggle */}
             <div className="mt-8 text-center">
                 <p className="text-sm text-white/60">
                    {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
                    <button 
                        onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                        className="text-white font-semibold hover:underline focus:outline-none ml-1"
                    >
                        {authMode === 'login' ? 'Sign up' : 'Log in'}
                    </button>
                 </p>
             </div>
        </div>
        
        {/* Footer Links */}
        <div className="mt-8 text-center text-xs text-white/30 space-x-4">
            <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
            <span>&bull;</span>
            <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
    