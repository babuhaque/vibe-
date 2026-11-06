import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Language } from '../types/solovvo';

interface PWAInstallButtonProps {
  language: Language;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ language }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
        title="Install Solovvo PWA to Home Screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{language === 'en' ? 'Install App' : 'ইনস্টল'}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors"
          title="Add Solovvo to iOS Home Screen"
        >
          <Smartphone className="w-3.5 h-3.5 text-red-600" />
          <span className="hidden sm:inline">{language === 'en' ? 'Add to Home' : 'হোম স্ক্রিন'}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-red-600" />
                  {language === 'en' ? 'Install on iPhone / iPad' : 'আইফোন / আইপ্যাডে ইনস্টল করুন'}
                </h3>
                <button onClick={() => setShowIOSGuide(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <p>
                  1. Tap the <strong>Share</strong> icon (square with arrow) at the bottom of Safari.
                </p>
                <p>
                  2. Scroll down and tap <strong>"Add to Home Screen"</strong> (হোম স্ক্রিনে যোগ করুন).
                </p>
                <p>
                  3. Tap <strong>Add</strong> in the top right corner. Solovvo will appear on your home screen with push notifications!
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 transition-colors"
              >
                {language === 'en' ? 'Got It' : 'বুঝেছি'}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
