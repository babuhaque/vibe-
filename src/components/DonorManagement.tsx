import React, { useState } from 'react';
import { 
  Heart, Calendar, Award, CheckCircle, Shield, AlertCircle, Settings,
  Clock, Activity, MapPin, User, ChevronRight, Sparkles
} from 'lucide-react';
import { UserProfile, BloodGroup, Language } from '../types/solovvo';

interface DonorManagementProps {
  currentUser: UserProfile;
  language: Language;
  onUpdateAvailability: (available: boolean) => void;
  onUpdateIntervalDays: (days: number) => void;
}

export const DonorManagement: React.FC<DonorManagementProps> = ({
  currentUser,
  language,
  onUpdateAvailability,
  onUpdateIntervalDays,
}) => {
  const [customInterval, setCustomInterval] = useState<number>(currentUser.donationIntervalDays || 90);
  const [showConfigInterval, setShowConfigInterval] = useState(false);

  // Calculate days passed since last donation
  const lastDate = new Date(currentUser.lastDonationDate);
  const today = new Date('2026-11-06T10:34:35Z'); // Current time
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isMedicallyEligible = diffDays >= customInterval;
  const daysRemaining = Math.max(0, customInterval - diffDays);

  const handleIntervalSave = () => {
    onUpdateIntervalDays(customInterval);
    setShowConfigInterval(false);
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      
      {/* Donor Card Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        {/* Cover Photo */}
        <div className="h-32 w-full relative bg-slate-800">
          <img
            src={currentUser.coverUrl}
            alt="Cover"
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/90 backdrop-blur-xs flex items-center gap-1">
              <Heart className="w-3 h-3 fill-white" />
              {currentUser.bloodGroup} Donor
            </span>
            <span className="text-xs font-mono bg-black/40 px-2 py-0.5 rounded backdrop-blur-xs">
              ID: {currentUser.id}
            </span>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 pt-0 relative">
          <div className="flex items-end justify-between -mt-12 mb-3">
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-slate-900 shadow-md"
              />
              <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                currentUser.isAvailableDonor ? 'bg-emerald-500' : 'bg-slate-400'
              }`} />
            </div>

            {/* Availability Toggle (Part 2 Section D) */}
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'en' ? 'Available' : 'সক্রিয়'}
              </span>
              <button
                type="button"
                onClick={() => onUpdateAvailability(!currentUser.isAvailableDonor)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                  currentUser.isAvailableDonor ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    currentUser.isAvailableDonor ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {language === 'en' ? currentUser.name : (currentUser.nameBn || currentUser.name)}
              </h2>
              {currentUser.isVerified && (
                <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                  Verified
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{language === 'en' ? currentUser.location : (currentUser.locationBn || currentUser.location)}</span>
              <span>•</span>
              <span>{currentUser.phone}</span>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900">
              <span className="text-lg font-extrabold text-red-600 dark:text-red-400 block">
                {currentUser.donationCount}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {language === 'en' ? 'Verified Donations' : 'যাচাইকৃত রক্তদান'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-lg font-extrabold text-slate-900 dark:text-white block">
                {diffDays}d
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {language === 'en' ? 'Since Last Donation' : 'শেষ রক্তদানের ব্যবধান'}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900">
              <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 block">
                {isMedicallyEligible ? 'READY' : `${daysRemaining}d`}
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                {language === 'en' ? 'Medical Eligibility' : 'মেডিকেল যোগ্যতা'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configurable Medical Donation Interval (Rule: Part 2 Section D) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Medical Donation Interval Policy' : 'রক্তদানের ব্যবধান নীতিমালা'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'en' 
                  ? 'Configurable interval according to approved medical guidelines' 
                  : 'চিকিৎসা নির্দেশিকা অনুযায়ী ব্যবধান পরিবর্তনযোগ্য'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfigInterval(!showConfigInterval)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

        {/* Current status banner */}
        <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
          isMedicallyEligible
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-center gap-2">
            {isMedicallyEligible ? (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600" />
            )}
            <div>
              <span className="font-bold block">
                {isMedicallyEligible 
                  ? (language === 'en' ? 'Eligible to Donate Blood Today' : 'আজই রক্তদান করার যোগ্য')
                  : (language === 'en' ? `In Recovery Cooldown (${daysRemaining} days remaining)` : `পুনরুদ্ধারের সময়কাল (${daysRemaining} দিন বাকি)`)}
              </span>
              <span className="text-[11px] opacity-80">
                {language === 'en'
                  ? `Configured Medical Interval: ${customInterval} days (Standard WHO/Red Crescent guideline: 90-120 days)`
                  : `বর্তমান ব্যবধান: ${customInterval} দিন (WHO/রেড ক্রিসেন্ট গাইডলাইন: ৯০-১২০ দিন)`}
              </span>
            </div>
          </div>
        </div>

        {/* Interval Adjuster */}
        {showConfigInterval && (
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700 text-xs">
            <label className="font-semibold text-slate-700 dark:text-slate-300 block">
              {language === 'en' ? 'Custom Medical Safe Interval (Days):' : 'নিরাপদ বিরতির দিন সংখ্যা:'}
            </label>
            <div className="flex items-center gap-2">
              {[60, 90, 105, 120].map((d) => (
                <button
                  key={d}
                  onClick={() => setCustomInterval(d)}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                    customInterval === d
                      ? 'bg-red-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {d} {language === 'en' ? 'Days' : 'দিন'}
                </button>
              ))}
              <button
                onClick={handleIntervalSave}
                className="ml-auto px-3 py-1.5 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-lg font-bold"
              >
                {language === 'en' ? 'Save' : 'সংরক্ষণ'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Achievement Badges System (Part 2 Section C) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          {language === 'en' ? 'Achievement Badges & Honours' : 'অর্জিত ব্যাজ ও সম্মাননা'}
        </h3>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {currentUser.badges.map((b) => (
            <div
              key={b}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{b}</span>
                <span className="text-[10px] text-slate-500">
                  {language === 'en' ? 'Verified by Solovvo' : 'সোলোভো দ্বারা অনুমোদিত'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Donation History Log */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-red-600" />
            {language === 'en' ? 'Donation History Records' : 'রক্তদানের ইতিহাস'}
          </h3>
          <span className="text-[11px] text-slate-400">
            {currentUser.donationCount} {language === 'en' ? 'Total Records' : 'মোট রেকর্ড'}
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Dhaka Medical College Hospital (DMCH)
              </span>
              <span className="text-[11px] text-slate-500">Emergency Maternity Support • 1 Bag O+</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 font-semibold">2026-08-01</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                National Heart Foundation, Mirpur
              </span>
              <span className="text-[11px] text-slate-500">Cardiac Bypass Operation • 1 Bag O+</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 font-semibold">2026-04-18</span>
          </div>

          <div className="py-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white block">
                Bangladesh Red Crescent Society Camp
              </span>
              <span className="text-[11px] text-slate-500">Voluntary Camp Donation • 1 Bag O+</span>
            </div>
            <span className="font-mono text-[11px] text-emerald-600 font-semibold">2026-01-10</span>
          </div>
        </div>
      </div>

    </div>
  );
};
