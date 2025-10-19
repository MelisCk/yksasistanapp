import React, { useState, useEffect } from 'react';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { SubjectTracking } from './components/SubjectTracking';
import { PracticeTests } from './components/PracticeTests';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { BottomNavigation } from './components/BottomNavigation';
import { Settings as SettingsIcon } from 'lucide-react';
import { Button } from './components/ui/button';

interface User {
  name: string;
  email: string;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isGuest, setIsGuest] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem('yks_user');
    const savedGuest = localStorage.getItem('yks_guest');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else if (savedGuest) {
      setIsGuest(true);
      setUser({ name: 'Misafir Kullanıcı', email: 'guest@example.com' });
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsGuest(false);
    localStorage.setItem('yks_user', JSON.stringify(userData));
    localStorage.removeItem('yks_guest');
  };

  const handleGuestLogin = () => {
    const guestUser = { name: 'Misafir Kullanıcı', email: 'guest@example.com' };
    setUser(guestUser);
    setIsGuest(true);
    localStorage.setItem('yks_guest', 'true');
    localStorage.removeItem('yks_user');
  };

  const handleLogout = () => {
    setUser(null);
    setIsGuest(false);
    setActiveTab('dashboard');
    setShowSettings(false);
    localStorage.removeItem('yks_user');
    localStorage.removeItem('yks_guest');
  };

  if (!user) {
    return <AuthScreen onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
  }

  const renderContent = () => {
    if (showSettings) {
      return <Settings user={user} onLogout={handleLogout} onBack={() => setShowSettings(false)} />;
    }
    
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'subjects':
        return <SubjectTracking />;
      case 'tests':
        return <PracticeTests user={user} />;
      case 'profile':
        return <Profile user={user} onLogout={handleLogout} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-blue-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">Y</span>
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-900 to-blue-700 bg-clip-text text-transparent">
                YKS Asistan
              </h1>
            </div>
            <div className="flex items-center gap-1.5">
              {isGuest && (
                <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-medium">
                  Misafir
                </div>
              )}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowSettings(!showSettings)}
                className="hover:bg-blue-100"
              >
                <SettingsIcon className="w-5 h-5 text-blue-900" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto px-4 pt-6 pb-24">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}