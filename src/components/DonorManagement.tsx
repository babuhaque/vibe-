import React, { useState } from 'react';
import { 
  Heart, Calendar, Award, CheckCircle, Shield, AlertCircle, Settings,
  Clock, Activity, MapPin, User, ChevronRight, Sparkles, QrCode,
  Download, Share2, Plus, FileText, Check, X, ShieldCheck, Thermometer,
  Scale, Stethoscope, Droplet, ExternalLink
} from 'lucide-react';
import { UserProfile, BloodGroup, Language, ScheduledDonation, DonationHistoryRecord } from '../types/solovvo';
import { DonationScheduler } from './DonationScheduler';

interface DonorManagementProps {
  currentUser: UserProfile;
  scheduledDonations: ScheduledDonation[];
  donationHistoryRecords: DonationHistoryRecord[];
  language: Language;
  onUpdateAvailability: (available: boolean) => void;
  onUpdateIntervalDays: (days: number) => void;
  onAddScheduledDonation: (donation: Omit<ScheduledDonation, 'id' | 'createdAt'>) => void;
  onUpdateScheduledStatus: (id: string, status: ScheduledDonation['status']) => void;
  onDeleteScheduledDonation: (id: string) => void;
  onAddDonationRecord: (record: Omit<DonationHistoryRecord, 'id' | 'certificateId' | 'verifiedDate'>) => void;
}

export const DonorManagement: React.FC<DonorManagementProps> = ({
  currentUser,
  scheduledDonations,
  donationHistoryRecords,
  language,
  onUpdateAvailability,
  onUpdateIntervalDays,
  onAddScheduledDonation,
  onUpdateScheduledStatus,
  onDeleteScheduledDonation,
  onAddDonationRecord,
}) => {
  const [customInterval, setCustomInterval] = useState<number>(currentUser.donationIntervalDays || 90);
  const [showConfigInterval, setShowConfigInterval] = useState(false);
  
  // Modals
  const [showDonorCard, setShowDonorCard] = useState(false);
  const [showAddRecordModal, setShowAddRecordModal] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<DonationHistoryRecord | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<'all' | 'whole_blood' | 'platelets' | 'plasma'>('all');

  // New Record Form State
  const [newHospital, setNewHospital] = useState('Dhaka Medical College Hospital (DMCH)');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newUnits, setNewUnits] = useState(1);
  const [newType, setNewType] = useState<DonationHistoryRecord['donationType']>('whole_blood');
  const [newContext, setNewContext] = useState('Emergency Transfusion Medicine Dept');
  const [newDoctor, setNewDoctor] = useState('Dr. Farhana Ahmed (Transfusion Officer)');

  // Calculate days passed since last donation
  const lastDate = new Date(currentUser.lastDonationDate);
  const today = new Date('2026-11-06T10:34:35Z');
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const isMedicallyEligible = diffDays >= customInterval;
  const daysRemaining = Math.max(0, customInterval - diffDays);

  const handleIntervalSave = () => {
    onUpdateIntervalDays(customInterval);
    setShowConfigInterval(false);
  };

  const handleCreateDonationRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospital.trim() || !newDate) return;

    onAddDonationRecord({
      donorId: currentUser.id,
      hospitalName: newHospital,
      hospitalAddress: 'Dhaka Metropolitan Area',
      donationDate: newDate,
      units: newUnits,
      donationType: newType,
      recipientContext: newContext,
      verifiedByDoctor: newDoctor,
    });

    setShowAddRecordModal(false);
  };

  // Filter history records
  const filteredRecords = donationHistoryRecords.filter((rec) => {
    if (historyFilter === 'all') return true;
    return rec.donationType === historyFilter;
  });

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-600/90 backdrop-blur-xs flex items-center gap-1">
              <Heart className="w-3 h-3 fill-white" />
              {currentUser.bloodGroup} Donor
            </span>

            {/* View Digital Donor ID Card Button */}
            <button
              onClick={() => setShowDonorCard(true)}
              className="text-xs font-bold bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-xl backdrop-blur-xs flex items-center gap-1.5 transition-colors border border-white/30"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'Digital Donor ID' : 'ডিজিটাল আইডি'}</span>
            </button>
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

      {/* Clinical Health Pre-Screening Vitals (WHO / Red Crescent criteria) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-red-600" />
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Medical Health Pre-Screening Vitals' : 'স্বাস্থ্যগত প্রাথমিক মাপকাঠি'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'en' ? 'Clinical suitability parameters for voluntary donation' : 'নিরাপদ রক্তদানের জন্য আবশ্যক শারীরিক মানদণ্ড'}
              </p>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
            HEALTH FIT
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Hemoglobin</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">13.8 g/dL</span>
            <span className="text-[10px] text-emerald-600 font-medium block">✓ ≥12.5 g/dL</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Body Weight</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">72 kg</span>
            <span className="text-[10px] text-emerald-600 font-medium block">✓ ≥50 kg</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">118/78</span>
            <span className="text-[10px] text-emerald-600 font-medium block">✓ Normal</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <span className="text-[10px] text-slate-500 block">Pulse Rate</span>
            <span className="font-bold text-slate-900 dark:text-white text-sm">72 bpm</span>
            <span className="text-[10px] text-emerald-600 font-medium block">✓ 60-100</span>
          </div>
        </div>
      </div>

      {/* Configurable Medical Donation Interval Policy */}
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
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
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
          <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 border border-slate-200 dark:border-slate-700 text-xs animate-in fade-in duration-100">
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

      {/* Donation Scheduler Feature */}
      <DonationScheduler
        currentUser={currentUser}
        scheduledDonations={scheduledDonations}
        language={language}
        onAddScheduledDonation={onAddScheduledDonation}
        onUpdateScheduledStatus={onUpdateScheduledStatus}
        onDeleteScheduledDonation={onDeleteScheduledDonation}
      />

      {/* Achievement Badges & Honor System */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            {language === 'en' ? 'Achievement Badges & Honours' : 'অর্জিত ব্যাজ ও সম্মাননা'}
          </h3>
          <span className="text-[11px] text-slate-400">
            {currentUser.badges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {currentUser.badges.map((b) => (
            <div
              key={b}
              onClick={() => setSelectedBadge(b)}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 cursor-pointer hover:border-amber-400 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-900 dark:text-white block text-[11px]">{b}</span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  ✓ {language === 'en' ? 'Unlocked' : 'অর্জিত'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Verified Donation History Log with Record Form & Certificate Actions */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-600" />
              {language === 'en' ? 'Verified Donation History Records' : 'যাচাইকৃত রক্তদানের ইতিহাস'}
            </h3>
            <span className="text-[11px] text-slate-400">
              {donationHistoryRecords.length} {language === 'en' ? 'Lifetime verified contributions' : 'টি সফল অবদান'}
            </span>
          </div>

          <button
            onClick={() => setShowAddRecordModal(true)}
            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Log Past Donation' : 'নতুন দান যুক্ত করুন'}</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 text-xs pt-1 overflow-x-auto">
          {(['all', 'whole_blood', 'platelets', 'plasma'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setHistoryFilter(filter)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                historyFilter === filter
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {filter === 'all' ? 'All Types' : filter.replace('_', ' ').toUpperCase()}
            </button>
          ))}
        </div>

        {/* Records List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          {filteredRecords.length === 0 ? (
            <div className="p-4 text-center text-slate-400 text-xs">
              No donation records found for this type.
            </div>
          ) : (
            filteredRecords.map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white">
                      {rec.hospitalName}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-600 font-extrabold text-[10px]">
                      {rec.units} Unit ({rec.donationType.replace('_', ' ')})
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {rec.recipientContext || 'Voluntary Blood Donation'} • {rec.verifiedByDoctor}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono text-[11px] text-slate-500">
                    {rec.donationDate}
                  </span>
                  <button
                    onClick={() => setSelectedCertificate(rec)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200"
                    title="View Certificate of Appreciation"
                  >
                    <FileText className="w-3.5 h-3.5 text-red-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL 1: DIGITAL BLOOD DONOR ID CARD */}
      {showDonorCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-red-500/40 bg-gradient-to-br from-red-600 via-rose-700 to-red-900 text-white p-6 relative space-y-4">
            <button
              onClick={() => setShowDonorCard(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white p-1"
            >
              ✕
            </button>

            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-white/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-black">
                  🩸
                </div>
                <div>
                  <h3 className="font-extrabold text-sm tracking-tight">Solovvo Donor ID Card</h3>
                  <span className="text-[10px] text-red-200 uppercase tracking-widest">Govt Verified Registry</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold">
                ACTIVE
              </span>
            </div>

            {/* Donor Identity Card Body */}
            <div className="flex items-center gap-4">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/60 shadow-md"
              />
              <div>
                <h4 className="text-base font-extrabold">{currentUser.name}</h4>
                <span className="text-xs text-red-100 block font-mono">ID: {currentUser.id}</span>
                <span className="text-xs text-red-200 block">{currentUser.location}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-black/20 p-3 rounded-2xl border border-white/10 text-xs">
              <div>
                <span className="text-[10px] text-red-200 block">Blood Group:</span>
                <span className="text-xl font-black text-white">{currentUser.bloodGroup}</span>
              </div>
              <div>
                <span className="text-[10px] text-red-200 block">Verified Donations:</span>
                <span className="text-xl font-black text-white">{currentUser.donationCount} Units</span>
              </div>
            </div>

            {/* Barcode & Security Hologram Simulation */}
            <div className="bg-white text-slate-900 p-2.5 rounded-xl flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="text-[9px] font-mono text-slate-500 block">REG: BD-BLOOD-2026-DH</span>
                <div className="flex gap-0.5 h-6 items-end">
                  {[4, 2, 5, 3, 6, 2, 4, 7, 3, 5, 2, 6, 3, 4, 7, 2, 5].map((h, i) => (
                    <div key={i} className="bg-slate-800 w-1" style={{ height: `${h * 3}px` }} />
                  ))}
                </div>
              </div>
              <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-300">
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
            </div>

            <button
              onClick={() => {
                alert('Digital Blood Donor Card ready for download or mobile wallet storage!');
                setShowDonorCard(false);
              }}
              className="w-full py-2 bg-white text-red-700 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors shadow-md flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Digital Donor Card</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: LOG PAST DONATION FORM */}
      {showAddRecordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-red-600" />
                {language === 'en' ? 'Record Verified Blood Donation' : 'রক্তদানের তথ্য লিপিবদ্ধ করুন'}
              </h3>
              <button onClick={() => setShowAddRecordModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateDonationRecord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hospital / Blood Transfusion Center:
                </label>
                <input
                  type="text"
                  required
                  value={newHospital}
                  onChange={(e) => setNewHospital(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Donation Date:
                  </label>
                  <input
                    type="date"
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Donation Type:
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  >
                    <option value="whole_blood">Whole Blood (হোল ব্লাড)</option>
                    <option value="platelets">Platelets (প্লাটিলেট)</option>
                    <option value="plasma">Plasma (প্লাজমা)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Recipient or Clinical Context:
                </label>
                <input
                  type="text"
                  value={newContext}
                  onChange={(e) => setNewContext(e.target.value)}
                  placeholder="e.g. Emergency surgery / Thalassemia child transfusion"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attending Medical Officer / Doctor:
                </label>
                <input
                  type="text"
                  value={newDoctor}
                  onChange={(e) => setNewDoctor(e.target.value)}
                  placeholder="e.g. Dr. Farhana Ahmed (BMDC-A-48910)"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 text-[11px] text-red-900 dark:text-red-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <p>
                  Adding a verified donation automatically updates your official donation count and resets your medical recovery countdown according to clinical guidelines.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddRecordModal(false)}
                  className="px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors"
                >
                  Save &amp; Verify
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CERTIFICATE OF LIFE SAVING DONATION */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border-4 border-amber-400 text-slate-900 dark:text-white space-y-4 relative">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-600 flex items-center justify-center mx-auto mb-2">
                <Award className="w-7 h-7" />
              </div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block">
                Certificate of Life Saving Contribution
              </span>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Humanitarian Blood Donor Award
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 text-center leading-relaxed italic">
              This certifies that <strong>{currentUser.name}</strong> ({currentUser.bloodGroup}) voluntarily donated 1 Unit of {selectedCertificate.donationType.replace('_', ' ')} on {selectedCertificate.donationDate} at {selectedCertificate.hospitalName}.
            </p>

            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1 text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Certificate ID:</span>
                <span className="font-mono font-bold">{selectedCertificate.certificateId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Clinical Officer:</span>
                <span className="font-semibold">{selectedCertificate.verifiedByDoctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="text-emerald-600 font-bold">✓ Medically Verified</span>
              </div>
            </div>

            <button
              onClick={() => {
                alert('Certificate image generated for sharing or printing!');
                setSelectedCertificate(null);
              }}
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official Certificate</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: ACHIEVEMENT BADGE DETAILS */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {selectedBadge}
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Awarded to voluntary donors demonstrating exemplary emergency commitment and verified donations on the Solovvo platform.
            </p>
            <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs text-left">
              <span className="font-bold text-emerald-600 block">✓ Milestone Complete</span>
              <span className="text-slate-500 text-[11px]">Rank: Senior Lifesaver Community Pillar</span>
            </div>
            <button
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
