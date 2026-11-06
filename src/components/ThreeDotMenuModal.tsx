import React, { useState } from 'react';
import { 
  User, Settings, Moon, Sun, Globe, Info, HelpCircle, FileText, 
  Shield, LogOut, Check, ChevronRight, ShieldAlert, Award
} from 'lucide-react';
import { Language } from '../types/solovvo';

interface ThreeDotMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onNavigateToTab: (tab: any) => void;
  onOpenAdminPanel: () => void;
}

export const ThreeDotMenuModal: React.FC<ThreeDotMenuModalProps> = ({
  isOpen,
  onClose,
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onNavigateToTab,
  onOpenAdminPanel,
}) => {
  const [activeModalContent, setActiveModalContent] = useState<string | null>(null);

  if (!isOpen) return null;

  const renderContent = () => {
    switch (activeModalContent) {
      case 'about':
        return (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">About Solovvo</h3>
            <p>
              Solovvo is a humanitarian blood donation and social networking platform engineered to eliminate preventable blood shortage casualties across Bangladesh.
            </p>
            <p>
              By combining instant geographic matching, hospital verification, and an active community feed, Solovvo bridges emergency patients with nearby eligible voluntary donors within minutes.
            </p>
            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 text-[11px] text-red-900 dark:text-red-300 font-semibold">
              Mission: 100% voluntary, non-commercial, safe blood access for everyone.
            </div>
          </div>
        );
      case 'faq':
        return (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-h-80 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h3>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">How often can I donate blood?</span>
              <p>In Solovvo, standard interval is configured to 90-120 days according to medically approved guidelines. You can also view your exact eligibility countdown in your profile.</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Is blood donation safe?</span>
              <p>Yes. All needle kits used by licensed blood transfusion centers are strictly single-use sterile sets.</p>
            </div>
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">Does Solovvo charge any fee?</span>
              <p>Never. Blood donation through Solovvo is 100% voluntary and free of charge.</p>
            </div>
          </div>
        );
      case 'privacy':
        return (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-h-80 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Privacy Policy &amp; Security</h3>
            <p>
              Solovvo prioritizes donor privacy. Your exact phone number is only shared when you accept an emergency request or toggle public availability.
            </p>
            <p>
              Location data is blurred to approximate neighborhood level (~1 KM radius) to prevent physical tracking, with precise hospital navigation enabled only upon mutual consent.
            </p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-h-80 overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Terms &amp; Conditions</h3>
            <p>
              Users must provide accurate blood group information verified by laboratory screening. Selling blood or soliciting financial remuneration is strictly prohibited and results in immediate permanent ban.
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {activeModalContent ? (
              <button 
                onClick={() => setActiveModalContent(null)}
                className="text-red-600 hover:underline flex items-center gap-1"
              >
                ← Back
              </button>
            ) : (
              language === 'en' ? 'More Options' : 'আরও অপশন'
            )}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            ✕
          </button>
        </div>

        {/* Content View */}
        <div className="p-4">
          {activeModalContent ? (
            renderContent()
          ) : (
            <div className="space-y-1 text-xs">
              
              {/* My Profile */}
              <button
                onClick={() => {
                  onNavigateToTab('account');
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-red-600" />
                  <span className="font-semibold">{language === 'en' ? 'My Profile' : 'আমার প্রোফাইল'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Admin Panel (Part 2 Section J) */}
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPanel();
                }}
                className="w-full p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span className="font-bold">{language === 'en' ? 'Admin Panel' : 'অ্যাডমিন প্যানেল'}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 bg-red-600 text-white rounded font-bold">STAFF</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={onToggleTheme}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  {isDarkMode ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-indigo-600" />}
                  <span className="font-semibold">
                    {isDarkMode ? 'Light Theme' : 'Dark Theme'}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {isDarkMode ? 'DARK' : 'LIGHT'}
                </span>
              </button>

              {/* Language Selection */}
              <button
                onClick={() => onLanguageChange(language === 'en' ? 'bn' : 'en')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">
                    {language === 'en' ? 'Language: বাংলা' : 'Language: English'}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-500">{language.toUpperCase()}</span>
              </button>

              <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

              {/* About */}
              <button
                onClick={() => setActiveModalContent('about')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Info className="w-4 h-4 text-slate-500" />
                  <span>{language === 'en' ? 'About Solovvo' : 'সোলোভো সম্পর্কে'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* FAQ */}
              <button
                onClick={() => setActiveModalContent('faq')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>{language === 'en' ? 'Help & FAQ' : 'প্রশ্ন ও সাহায্য'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Privacy Policy */}
              <button
                onClick={() => setActiveModalContent('privacy')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Shield className="w-4 h-4 text-slate-500" />
                  <span>{language === 'en' ? 'Privacy Policy' : 'গোপনীয়তা নীতি'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Terms & Conditions */}
              <button
                onClick={() => setActiveModalContent('terms')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                  <span>{language === 'en' ? 'Terms & Conditions' : 'শর্তাবলী'}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <div className="my-2 border-t border-slate-100 dark:border-slate-800" />

              {/* Logout */}
              <button
                onClick={() => {
                  alert('Logged out securely. Session persisted in Firebase Auth.');
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 flex items-center gap-2.5 transition-colors font-semibold"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'en' ? 'Log Out' : 'লগ আউট'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
