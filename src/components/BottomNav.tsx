import React from 'react';
import { Home, Bell, Activity, User, Search, PlusCircle } from 'lucide-react';
import { Language } from '../types/solovvo';

export type TabType = 'home' | 'search' | 'activity' | 'notifications' | 'account' | 'security';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  language: Language;
  unreadNotificationsCount: number;
  onOpenEmergencyModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  language,
  unreadNotificationsCount,
  onOpenEmergencyModal,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg transition-colors">
      <div className="max-w-md sm:max-w-xl mx-auto px-2 flex items-center justify-around h-16 relative">
        
        {/* 1. Home Feed */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'home'
              ? 'text-red-600 dark:text-red-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">
            {language === 'en' ? 'Home' : 'হোম'}
          </span>
        </button>

        {/* 2. Blood Search (Normal Search & Map) */}
        <button
          onClick={() => onTabChange('search')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'search'
              ? 'text-red-600 dark:text-red-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Search className={`w-5 h-5 ${activeTab === 'search' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">
            {language === 'en' ? 'Search' : 'সার্চ'}
          </span>
        </button>

        {/* Center Floating Emergency Blood Request Button */}
        <div className="flex-1 flex justify-center -mt-5">
          <button
            onClick={onOpenEmergencyModal}
            className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 hover:bg-red-700 active:scale-95 transition-all ring-4 ring-white dark:ring-slate-900"
            title="Create Emergency Blood Request"
          >
            <PlusCircle className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>

        {/* 3. Activity (Donations & Emergency Requests) */}
        <button
          onClick={() => onTabChange('activity')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'activity'
              ? 'text-red-600 dark:text-red-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <Activity className={`w-5 h-5 ${activeTab === 'activity' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">
            {language === 'en' ? 'Activity' : 'অ্যাক্টিভিটি'}
          </span>
        </button>

        {/* 4. Notifications */}
        <button
          onClick={() => onTabChange('notifications')}
          className={`relative flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'notifications'
              ? 'text-red-600 dark:text-red-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${activeTab === 'notifications' ? 'stroke-[2.5]' : ''}`} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
            )}
          </div>
          <span className="text-[11px] mt-1">
            {language === 'en' ? 'Alerts' : 'বিজ্ঞপ্তি'}
          </span>
        </button>

        {/* 5. My Account */}
        <button
          onClick={() => onTabChange('account')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'account'
              ? 'text-red-600 dark:text-red-500 font-bold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'account' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[11px] mt-1">
            {language === 'en' ? 'Account' : 'প্রোফাইল'}
          </span>
        </button>
      </div>
    </nav>
  );
};
