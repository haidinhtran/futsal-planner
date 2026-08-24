import React from 'react';
import { Users, Layout, PenTool, Settings } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: 'tactics' | 'players' | 'presentation' | 'settings';
  setActiveTab: (tab: 'tactics' | 'players' | 'presentation' | 'settings') => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'tactics', label: 'Đội Hình', icon: Layout },
    { id: 'players', label: 'Cầu Thủ', icon: Users },
    { id: 'presentation', label: 'Mô Phỏng', icon: PenTool },
    { id: 'settings', label: 'Cài Đặt', icon: Settings },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 flex justify-around items-center h-[calc(4rem+env(safe-area-inset-bottom,0px))] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom,0px)]">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-blue-100' : 'bg-transparent'}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className={`text-[10px] font-bold ${isActive ? 'text-blue-700' : ''}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
