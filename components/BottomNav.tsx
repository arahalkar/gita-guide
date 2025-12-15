import React from 'react';
import { Home, MessageCircle, FileText } from 'lucide-react';
import { View } from '../types';

interface BottomNavProps {
  currentView: View;
  setView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: 'home', label: 'Chapters', icon: Home },
    { id: 'chat', label: 'Ask Krishna', icon: MessageCircle },
    { id: 'resources', label: 'Resources', icon: FileText },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-krishna-200 shadow-lg z-50 pb-safe">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id || (currentView === 'chapter' && item.id === 'home');
          
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as View)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                isActive ? 'text-peacock-700' : 'text-krishna-300 hover:text-krishna-500'
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? 'fill-current' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;