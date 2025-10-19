import React from 'react';
import { Button } from './ui/button';
import { Home, BookOpen, FileText, User } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Anasayfa', icon: Home },
    { id: 'subjects', label: 'Konu Takip', icon: BookOpen },
    { id: 'tests', label: 'Deneme', icon: FileText },
    { id: 'profile', label: 'Profil', icon: User }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 shadow-lg">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="grid grid-cols-4 gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <Button
                key={tab.id}
                type="button"
                variant="ghost"
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center space-y-1 py-3 px-2 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-blue-900 text-white shadow-lg' 
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>
                  {tab.label}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}