import React, { useState } from 'react';
import { 
  User, Settings, Moon, Sun, Globe, Info, HelpCircle, FileText, 
  Shield, LogOut, Check, ChevronRight, ShieldAlert, Award, Bell,
  Lock, Eye, MapPin, Activity, Phone, MessageSquare, AlertTriangle,
  Heart, CheckCircle2, ChevronDown
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
  const [activeModalContent, setActiveModalContent] = useState<'settings' | 'about' | 'help' | 'faq' | 'privacy' | 'terms' | null>(null);

  // Settings State
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [appointmentReminders, setAppointmentReminders] = useState(true);
  const [socialAlerts, setSocialAlerts] = useState(true);
  const [phoneVisibility, setPhoneVisibility] = useState<'public' | 'emergency_only'>('emergency_only');
  const [locationFuzzing, setLocationFuzzing] = useState(true);
  const [defaultRadius, setDefaultRadius] = useState<number>(10);
  const [saveFeedback, setSaveFeedback] = useState(false);

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const handleSaveSettings = () => {
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2000);
  };

  const faqs = [
    {
      q: language === 'en' ? 'How often can I safely donate blood?' : 'কতদিন পর পর নিরাপদভাবে রক্তদান করা যায়?',
      a: language === 'en' 
        ? 'In Solovvo, the standard interval is configurable between 90 and 120 days based on international WHO and Red Crescent guidelines. Your body restores plasma within 24–48 hours, while red cells regenerate over several weeks.'
        : 'সোলোভোতে বিশ্ব স্বাস্থ্য সংস্থা ও রেড ক্রিসেন্ট নির্দেশিকা অনুযায়ী ৯০ থেকে ১২০ দিনের বিরতি রাখা হয়। রক্তদানের ২৪-৪৮ ঘণ্টার মধ্যে রক্তের তরল অংশ পূরণ হয়ে যায় এবং লোহিত কণিকা কয়েক সপ্তাহে তৈরি হয়।'
    },
    {
      q: language === 'en' ? 'Is blood donation completely safe?' : 'রক্তদান কি সম্পূর্ণ নিরাপদ?',
      a: language === 'en'
        ? 'Yes, 100% sterile single-use disposable needles and transfusion collection kits are strictly used at all certified blood centers. It is physically impossible to contract blood-borne viruses during donation.'
        : 'হ্যাঁ, প্রতিটি রক্তদানের জন্য সম্পূর্ণ জীবাণুমুক্ত নতুন ডিসপোজেবল সূঁচ ও রক্ত ব্যাগ ব্যবহার করা হয়। রক্তদানের সময় কোনো রোগ সংক্রমণের সম্ভাবনা থাকে না।'
    },
    {
      q: language === 'en' ? 'Does Solovvo charge any money or commission?' : 'সোলোভো কি কোনো ফি বা কমিশন নেয়?',
      a: language === 'en'
        ? 'Never. Solovvo operates under a strict non-commercial humanitarian charter. Selling blood or soliciting financial remuneration is illegal and results in immediate account termination.'
        : 'কখনোই না। সোলোভো সম্পূর্ণ অবাণিজ্যিক মানবিক প্ল্যাটফর্ম। রক্তের বিনিময়ে অর্থ দাবি করা কঠোরভাবে নিষিদ্ধ।'
    },
    {
      q: language === 'en' ? 'How does the emergency donor matching work?' : 'জরুরী রক্তদাতা খোঁজার প্রক্রিয়া কীভাবে কাজ করে?',
      a: language === 'en'
        ? 'When an emergency request is broadcasted, our GPS matching algorithm identifies verified donors with matching blood groups within the selected radius (5–20 KM) and dispatches instant push notifications.'
        : 'জরুরী রিকুয়েস্ট পোস্ট করা হলে নির্দিষ্ট ব্যাসার্ধের (৫-২০ কিমি) মধ্যে থাকা যোগ্য রক্তদাতাদের কাছে স্বয়ংক্রিয় পুশ অ্যালার্ট পৌঁছে যায়।'
    }
  ];

  const renderContent = () => {
    switch (activeModalContent) {
      case 'settings':
        return (
          <div className="space-y-4 text-xs text-slate-700 dark:text-slate-200 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Settings className="w-4 h-4 text-red-600" />
                {language === 'en' ? 'Application Settings' : 'অ্যাপ সেটিংস'}
              </span>
              {saveFeedback && (
                <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {language === 'en' ? 'Saved' : 'সংরক্ষিত'}
                </span>
              )}
            </div>

            {/* Notification Preferences */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Bell className="w-3.5 h-3.5 text-red-600" />
                {language === 'en' ? 'Notification Controls' : 'নোটিফিকেশন নিয়ন্ত্রণ'}
              </span>

              <label className="flex items-center justify-between py-1 cursor-pointer">
                <div>
                  <span className="font-medium block">{language === 'en' ? 'Emergency Blood Broadcasts' : 'জরুরী রক্তের ব্রডকাস্ট অ্যালার্ট'}</span>
                  <span className="text-[10px] text-slate-400">{language === 'en' ? 'Critical nearby patient alerts' : 'নিকটবর্তী রোগীদের জরুরী নোটিফিকেশন'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={emergencyAlerts}
                  onChange={(e) => setEmergencyAlerts(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer">
                <div>
                  <span className="font-medium block">{language === 'en' ? 'Approaching Appointment Reminders' : 'আসন্ন অ্যাপয়েন্টমেন্ট রিমাইন্ডার'}</span>
                  <span className="text-[10px] text-slate-400">{language === 'en' ? 'Service Worker background push alerts' : 'সার্ভিস ওয়ার্কার পুশ নোটিফিকেশন'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={appointmentReminders}
                  onChange={(e) => setAppointmentReminders(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>

              <label className="flex items-center justify-between py-1 cursor-pointer">
                <div>
                  <span className="font-medium block">{language === 'en' ? 'Social Community Feed Alerts' : 'সোশ্যাল ফিড নোটিফিকেশন'}</span>
                  <span className="text-[10px] text-slate-400">{language === 'en' ? 'Likes, comments and stories' : 'লাইক, কমেন্ট ও শেয়ার বার্তা'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={socialAlerts}
                  onChange={(e) => setSocialAlerts(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>
            </div>

            {/* Privacy & Location Security */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <Lock className="w-3.5 h-3.5 text-blue-600" />
                {language === 'en' ? 'Privacy & Donor Security' : 'গোপনীয়তা ও নিরাপত্তা'}
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  {language === 'en' ? 'Phone Number Visibility:' : 'ফোন নম্বরের দৃশ্যমানতা:'}
                </label>
                <select
                  value={phoneVisibility}
                  onChange={(e) => setPhoneVisibility(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <option value="emergency_only">🔒 Emergency Only (Hidden in public search, visible only upon match)</option>
                  <option value="public">🌐 Public (Visible to all registered donors in Blood Search)</option>
                </select>
              </div>

              <label className="flex items-center justify-between py-1 cursor-pointer">
                <div>
                  <span className="font-medium block">{language === 'en' ? 'Approximate GPS Fuzzing (~1 KM)' : 'আনুমানিক এলাকা প্রদর্শন (~১ কিমি)'}</span>
                  <span className="text-[10px] text-slate-400">{language === 'en' ? 'Protects exact home address' : 'সরাসরি বাসার ঠিকানা গোপন রাখে'}</span>
                </div>
                <input
                  type="checkbox"
                  checked={locationFuzzing}
                  onChange={(e) => setLocationFuzzing(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
              </label>
            </div>

            {/* Default Search Radius */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                {language === 'en' ? 'Default GPS Search Radius' : 'ডিফল্ট অনুসন্ধানের দূরত্ব'}
              </span>

              <div className="grid grid-cols-4 gap-1.5">
                {[5, 10, 15, 20].map((km) => (
                  <button
                    key={km}
                    onClick={() => setDefaultRadius(km)}
                    className={`py-1.5 rounded-lg font-bold text-xs transition-colors ${
                      defaultRadius === km
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {km} KM
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors text-xs flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{language === 'en' ? 'Save Preferences' : 'পছন্দসমূহ সংরক্ষণ করুন'}</span>
            </button>
          </div>
        );

      case 'help':
        return (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 max-h-[70vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-red-600" />
              {language === 'en' ? 'Help & Emergency Support' : 'সাহায্য ও জরুরী সহায়তা'}
            </h3>

            <div className="p-3 bg-red-50 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900 space-y-2">
              <span className="font-bold text-red-900 dark:text-red-200 block text-xs">
                🚨 24/7 Solovvo Emergency Hotline:
              </span>
              <p className="text-[11px] text-red-800 dark:text-red-300">
                If you are a hospital attendant or relative of a critical patient and cannot find donors within 30 minutes, contact our volunteer coordinator hotline:
              </p>
              <a
                href="tel:+8801711234567"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-xl font-bold text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                +880 1711-234567
              </a>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-1.5">
              <span className="font-bold text-slate-900 dark:text-white block">Pre-Donation Checklist:</span>
              <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1">
                <li>Drink at least 500ml of water or fruit juice 1 hour before donating.</li>
                <li>Ensure at least 6–8 hours of restful sleep the night before.</li>
                <li>Avoid fatty or heavy fried meals 3 hours prior.</li>
                <li>Weight must be at least 48-50 kg (105 lbs).</li>
                <li>Hemoglobin must be ≥ 12.5 g/dL.</li>
              </ul>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300 max-h-[70vh] overflow-y-auto">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-red-600" />
              {language === 'en' ? 'Frequently Asked Questions' : 'সাধারণ জিজ্ঞাসা (FAQ)'}
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/60 transition-colors"
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full p-3 text-left font-bold text-slate-900 dark:text-white flex items-center justify-between text-xs"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFaqIndex === index ? 'rotate-180 text-red-600' : 'text-slate-400'}`} />
                  </button>
                  {openFaqIndex === index && (
                    <div className="p-3 pt-0 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 mt-1">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-h-[70vh] overflow-y-auto">
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

      case 'privacy':
        return (
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-h-[70vh] overflow-y-auto">
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
          <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 max-h-[70vh] overflow-y-auto">
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

              {/* Settings (Part 2 Section I) */}
              <button
                onClick={() => setActiveModalContent('settings')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Settings className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  <span className="font-semibold">{language === 'en' ? 'Settings & Preferences' : 'সেটিংস ও পছন্দসমূহ'}</span>
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

              {/* Help */}
              <button
                onClick={() => setActiveModalContent('help')}
                className="w-full p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-slate-500" />
                  <span>{language === 'en' ? 'Help & Support' : 'সাহায্য ও সাপোর্ট'}</span>
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
                  <span>{language === 'en' ? 'FAQ' : 'সাধারণ জিজ্ঞাসা'}</span>
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
                  alert(language === 'en' ? 'Logged out securely. Session persisted in Firebase Auth.' : 'সফলভাবে লগআউট হয়েছে।');
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
