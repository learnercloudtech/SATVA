import React, { useState, useMemo } from 'react';
import { UserRole } from './types';
import Header from './components/Header';
import StudentDashboard from './components/StudentDashboard';
import EducatorDashboard from './components/EducatorDashboard';
import FeedbackPortal from './components/FeedbackPortal';
import LearningModules from './components/LearningModules';
import AuthPage from './components/AuthPage';

type View = 'dashboard' | 'feedback' | 'modules';
export interface User {
  name: string;
  role: UserRole;
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [studentView, setStudentView] = useState<View>('dashboard');

  const handleLogin = (name: string, role: UserRole) => {
    setUser({ name, role });
  };
  
  const handleLogout = () => {
    setUser(null);
  };

  const mainContent = useMemo(() => {
    if (!user) return null;

    if (user.role === UserRole.Educator) {
      return <EducatorDashboard />;
    }

    switch (studentView) {
      case 'dashboard':
        return <StudentDashboard />;
      case 'feedback':
        return <FeedbackPortal />;
      case 'modules':
        return <LearningModules />;
      default:
        return <StudentDashboard />;
    }
  }, [user, studentView]);
  
  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen text-white/90">
      <Header 
        user={user}
        onLogout={handleLogout}
        currentView={studentView}
        onViewChange={setStudentView}
      />
      <main className="p-4 sm:p-6 md:p-8">
        {mainContent}
      </main>
    </div>
  );
};

export default App;