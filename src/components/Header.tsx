import React from 'react';
import { Droplet, ShieldCheck, MoreVertical, Globe, Moon, Sun, BellRing } from 'lucide-react';
import { Language } from '../types/solovvo';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenThreeDotMenu: () => void;
  onOpenSecurityAudit: () => void;
  emergencyCount: number;
  onOpenEmergencyView: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isDarkMode,
  onToggleTheme,
  onOpenThreeDotMenu,
  onOpenSecurityAudit,
  emergencyCount,
  onOpenEmergencyView,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-red-100 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-red-600 text-white shadow-md shadow-red-500/20">
            <Droplet className="w-6 h-6 fill-white stroke-red-600 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-400 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight text-red-600 dark:text-red-500">
                Solovvo
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 uppercase tracking-wider">
                {language === 'en' ? 'Blood' : 'রক্তদান'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {language === 'en' ? 'Donation & Social Network' : 'রক্তদান ও সামাজিক নেটওয়ার্ক'}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Security Audit Badge for Stage 3.0.7 */}
          <button
            onClick={onOpenSecurityAudit}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors shadow-xs"
            title="Stage 3.0.7 Evidence-Based Security Audit Verification"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Stage 3.0.7</span>
            <span className="text-[10px] font-bold px-1 py-0.2 bg-emerald-200 dark:bg-emerald-900 rounded text-emerald-800 dark:text-emerald-200">
              SEC
            </span>
          </button>

          {/* Emergency Alert Indicator */}
          {emergencyCount > 0 && (
            <button
              onClick={onOpenEmergencyView}
              className="relative p-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              title={`${emergencyCount} Emergency Blood Requests Active`}
            >
              <BellRing className="w-5 h-5 animate-bounce" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                {emergencyCount}
              </span>
            </button>
          )}

          {/* Language Toggle (English / বাংলা) */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'bn' : 'en')}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-slate-500" />
            <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Three-Dot Menu */}
          <button
            onClick={onOpenThreeDotMenu}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="More Options"
          >
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
