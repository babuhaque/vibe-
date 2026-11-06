import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, MapPin, Bell, BellRing, BellOff, CheckCircle2, 
  AlertCircle, Plus, CalendarPlus, X, ChevronRight, Droplet, Check,
  Download, ShieldAlert, Sparkles, RefreshCw, Cpu, CheckCircle
} from 'lucide-react';
import { ScheduledDonation, UserProfile, Language } from '../types/solovvo';
import { 
  showServiceWorkerNotification, 
  checkApproachingAppointments, 
  getServiceWorkerStatus, 
  ServiceWorkerStatus 
} from '../utils/serviceWorkerManager';

interface DonationSchedulerProps {
  currentUser: UserProfile;
  scheduledDonations: ScheduledDonation[];
  language: Language;
  onAddScheduledDonation: (donation: Omit<ScheduledDonation, 'id' | 'createdAt'>) => void;
  onUpdateScheduledStatus: (id: string, status: ScheduledDonation['status']) => void;
  onDeleteScheduledDonation: (id: string) => void;
}

export const DonationScheduler: React.FC<DonationSchedulerProps> = ({
  currentUser,
  scheduledDonations,
  language,
  onAddScheduledDonation,
  onUpdateScheduledStatus,
  onDeleteScheduledDonation,
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [notificationFeedback, setNotificationFeedback] = useState<string | null>(null);
  const [swStatus, setSwStatus] = useState<ServiceWorkerStatus>({
    isSupported: true,
    isRegistered: false,
    isActive: false,
    permission: 'default',
  });
  const [isScanningApproaching, setIsScanningApproaching] = useState(false);

  // Form State
  const [donationType, setDonationType] = useState<ScheduledDonation['donationType']>('whole_blood');
  const [hospitalOrCenter, setHospitalOrCenter] = useState('Quantum Blood Lab, Kakrail');
  const [customCenter, setCustomCenter] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('10:30 AM');
  const [notes, setNotes] = useState('Regular voluntary donation. Remember pre-donation hydration.');
  const [reminderEnabled, setReminderEnabled] = useState(true);

  // Check current notification and Service Worker status on mount and when appointments change
  useEffect(() => {
    getServiceWorkerStatus().then((status) => {
      setSwStatus(status);
      setNotificationPermission(status.permission);
    });

    // Check approaching appointments with Service Worker in the background
    checkApproachingAppointments(scheduledDonations);
  }, [scheduledDonations]);

  // Calculate recommended safe date based on last donation date + user's configured interval
  const lastDate = new Date(currentUser.lastDonationDate);
  const intervalDays = currentUser.donationIntervalDays || 90;
  const safeNextDateObj = new Date(lastDate.getTime() + intervalDays * 24 * 60 * 60 * 1000);
  const safeNextDateString = safeNextDateObj.toISOString().split('T')[0];

  // Set default scheduled date to safeNextDate if empty
  useEffect(() => {
    if (!scheduledDate) {
      const todayStr = new Date().toISOString().split('T')[0];
      setScheduledDate(safeNextDateString > todayStr ? safeNextDateString : todayStr);
    }
  }, [safeNextDateString]);

  // Request browser notification permission
  const handleRequestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationFeedback(
        language === 'en' 
          ? 'Browser notifications are not supported in this browser.' 
          : 'এই ব্রাউজারে নোটিফিকেশন সুবিধা সমর্থিত নয়।'
      );
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      const updatedStatus = await getServiceWorkerStatus();
      setSwStatus(updatedStatus);

      if (permission === 'granted') {
        setNotificationFeedback(
          language === 'en'
            ? '✓ Browser notifications granted! Service Worker will deliver timely appointment reminders.'
            : '✓ ব্রাউজার নোটিফিকেশন সক্রিয় হয়েছে! সার্ভিস ওয়ার্কার সময়মতো রিমাইন্ডার পৌঁছে দেবে।'
        );
        await showServiceWorkerNotification(
          language === 'en' ? 'Solovvo Service Worker Ready 🩸' : 'সোলোভো সার্ভিস ওয়ার্কার প্রস্তুত 🩸',
          {
            body: language === 'en'
              ? `Local browser push notifications enabled for ${currentUser.name} (${currentUser.bloodGroup})`
              : `রক্তদানের স্থানীয় ব্রাউজার পুশ নোটিফিকেশন সক্রিয় করা হয়েছে।`,
            tag: 'solovvo-welcome',
          }
        );
      } else if (permission === 'denied') {
        setNotificationFeedback(
          language === 'en'
            ? 'Notifications were blocked in browser settings. You can re-enable them in browser site settings.'
            : 'ব্রাউজার সেটিংসে নোটিফিকেশন ব্লক করা আছে। আপনি সাইট সেটিংস থেকে অনুমতি দিতে পারেন।'
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Send test reminder for an appointment via Service Worker
  const handleSendTestReminder = async (appointment: ScheduledDonation) => {
    if (notificationPermission !== 'granted') {
      await handleRequestNotificationPermission();
      return;
    }

    const title = language === 'en'
      ? `Upcoming Blood Donation: ${appointment.hospitalOrCenter}`
      : `আসন্ন রক্তদান অ্যাপয়েন্টমেন্ট: ${appointment.hospitalOrCenter}`;

    const body = language === 'en'
      ? `Scheduled on ${appointment.scheduledDate} at ${appointment.scheduledTime}. Remember to drink at least 500ml of water and rest well!`
      : `তারিখ: ${appointment.scheduledDate}, সময়: ${appointment.scheduledTime}। রক্তদানের পূর্বে পর্যাপ্ত পানি পান করুন!`;

    const dispatched = await showServiceWorkerNotification(title, {
      body,
      appointmentId: appointment.id,
      tag: `solovvo-${appointment.id}`,
    });

    if (dispatched) {
      setNotificationFeedback(
        language === 'en'
          ? `✓ Service Worker notification dispatched for ${appointment.scheduledDate}!`
          : `✓ ${appointment.scheduledDate} তারিখের জন্য সার্ভিস ওয়ার্কার নোটিফিকেশন পাঠানো হয়েছে!`
      );
    }
    setTimeout(() => setNotificationFeedback(null), 4000);
  };

  // Manually scan approaching appointments with Service Worker
  const handleScanApproachingNow = async () => {
    if (notificationPermission !== 'granted') {
      await handleRequestNotificationPermission();
      return;
    }

    setIsScanningApproaching(true);
    await checkApproachingAppointments(scheduledDonations);

    // Demonstrate with next upcoming appointment
    const nextUpcoming = scheduledDonations.find(d => d.status === 'upcoming');
    if (nextUpcoming) {
      await showServiceWorkerNotification(
        language === 'en'
          ? `🩸 Approaching Donation: ${nextUpcoming.hospitalOrCenter}`
          : `🩸 আসন্ন রক্তদান: ${nextUpcoming.hospitalOrCenter}`,
        {
          body: language === 'en'
            ? `Service Worker checked: Your appointment is scheduled on ${nextUpcoming.scheduledDate} at ${nextUpcoming.scheduledTime}. Prepare with hydration!`
            : `সার্ভিস ওয়ার্কার দ্বারা যাচাইকৃত: আপনার রক্তদান ${nextUpcoming.scheduledDate} তারিখে ${nextUpcoming.scheduledTime} মিনিটে।`,
          appointmentId: nextUpcoming.id,
          tag: `solovvo-approaching-${nextUpcoming.id}`,
        }
      );
    }

    setNotificationFeedback(
      language === 'en'
        ? '✓ Service Worker scanned approaching appointments and dispatched alert!'
        : '✓ সার্ভিস ওয়ার্কার আসন্ন রক্তদানের তারিখ স্ক্যান করেছে এবং নোটিফিকেশন পাঠিয়েছে!'
    );
    setTimeout(() => {
      setIsScanningApproaching(false);
      setNotificationFeedback(null);
    }, 4000);
  };

  // Export to calendar (.ics format)
  const handleExportToCalendar = (appointment: ScheduledDonation) => {
    const cleanDate = appointment.scheduledDate.replace(/-/g, '');
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Solovvo//Blood Donation Scheduler//EN',
      'BEGIN:VEVENT',
      `SUMMARY:Solovvo Blood Donation - ${appointment.hospitalOrCenter}`,
      `DESCRIPTION:${appointment.notes || 'Voluntary blood donation appointment via Solovvo platform.'}`,
      `LOCATION:${appointment.hospitalOrCenter}, ${appointment.address}`,
      `DTSTART:${cleanDate}T040000Z`,
      `DTEND:${cleanDate}T050000Z`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `solovvo_donation_${appointment.scheduledDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit appointment
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCenter = hospitalOrCenter === 'Other / Custom Location' ? customCenter : hospitalOrCenter;
    if (!finalCenter || !scheduledDate) return;

    onAddScheduledDonation({
      donorId: currentUser.id,
      donationType,
      scheduledDate,
      scheduledTime,
      hospitalOrCenter: finalCenter,
      address: hospitalOrCenter.includes('Quantum')
        ? 'Shanti Nagar / Kakrail Road, Dhaka'
        : hospitalOrCenter.includes('DMCH')
        ? 'Secretariat Rd, Dhaka 1000'
        : 'Dhaka Metropolitan Area',
      notes,
      reminderEnabled,
      status: 'upcoming',
    });

    // Request notification permission if not yet decided and reminder enabled
    if (reminderEnabled && notificationPermission === 'default') {
      handleRequestNotificationPermission();
    } else if (reminderEnabled && notificationPermission === 'granted') {
      showServiceWorkerNotification(
        language === 'en' ? 'Appointment Scheduled! 🩸' : 'অ্যাপয়েন্টমেন্ট নির্ধারিত হয়েছে! 🩸',
        {
          body: language === 'en'
            ? `Your donation is scheduled for ${scheduledDate} at ${scheduledTime} (${finalCenter}). Service Worker will alert you as it approaches!`
            : `${scheduledDate} তারিখে ${scheduledTime} মিনিটে রক্তদানের শিডিউল নিশ্চিত করা হয়েছে।`,
          tag: `solovvo-scheduled-${Date.now()}`,
        }
      );
    }

    setIsFormOpen(false);
  };

  const centerOptions = [
    'Quantum Blood Lab, Kakrail',
    'Dhaka Medical College Hospital (DMCH)',
    'Bangladesh Red Crescent Blood Center, Mohammadpur',
    'Bangabandhu Sheikh Mujib Medical University (BSMMU)',
    'National Institute of Cardiovascular Diseases (NICVD)',
    'Evercare Hospital Blood Bank, Bashundhara',
    'Other / Custom Location',
  ];

  const upcomingAppointments = scheduledDonations.filter(d => d.status === 'upcoming');
  const pastAppointments = scheduledDonations.filter(d => d.status !== 'upcoming');

  // Check if chosen date is before safe medical recovery date
  const isBeforeSafeDate = scheduledDate && scheduledDate < safeNextDateString;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {language === 'en' ? 'Donation Scheduler & Reminders' : 'রক্তদান শিডিউলার ও রিমাইন্ডার'}
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-50 dark:bg-red-950 text-red-600 border border-red-200 dark:border-red-900">
                {language === 'en' ? 'Medical Interval Sync' : 'মেডিকেল বিরতি সিন্ক'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'en' 
                ? 'Plan your next life-saving donation with automated browser alerts' 
                : 'আপনার পরবর্তী রক্তদানের তারিখ নির্ধারণ করুন এবং ব্রাউজার নোটিফিকেশন পান'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          {isFormOpen ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
          <span>{isFormOpen ? (language === 'en' ? 'Close' : 'বন্ধ') : (language === 'en' ? 'Schedule' : 'শিডিউল করুন')}</span>
        </button>
      </div>

      {/* Recommended Medical Safe Window Notice */}
      <div className="p-3 bg-red-50/70 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-red-900 dark:text-red-200">
          <Droplet className="w-4 h-4 text-red-600 shrink-0 fill-red-600" />
          <div>
            <span className="font-bold block">
              {language === 'en' ? 'Next Safe Medical Date:' : 'পরবর্তী নিরাপদ রক্তদানের তারিখ:'}{' '}
              <span className="font-mono text-red-700 dark:text-red-300 font-extrabold">{safeNextDateString}</span>
            </span>
            <span className="text-[11px] text-red-700/80 dark:text-red-300/80">
              {language === 'en'
                ? `Calculated using your ${intervalDays}-day configured medical recovery cooldown.`
                : `আপনার নির্ধারিত ${intervalDays} দিনের স্বাস্থ্য বিরতি নিয়ম অনুসারে পরিগণিত।`}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setScheduledDate(safeNextDateString);
            setIsFormOpen(true);
          }}
          className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-red-300 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg text-[11px] font-bold hover:bg-red-50 transition-colors shrink-0"
        >
          {language === 'en' ? 'Book for This Date' : 'এই তারিখে বুক করুন'}
        </button>
      </div>

      {/* Service Worker & Browser Push Notification Banner */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            {notificationPermission === 'granted' ? (
              <BellRing className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : notificationPermission === 'denied' ? (
              <BellOff className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <Bell className="w-4 h-4 text-amber-500 shrink-0" />
            )}
            <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${
              swStatus.isRegistered ? 'bg-emerald-500 ring-1 ring-white dark:ring-slate-900' : 'bg-slate-400'
            }`} />
          </div>

          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {language === 'en' ? 'Service Worker Push Notifications:' : 'সার্ভিস ওয়ার্কার পুশ নোটিফিকেশন:'}
              </span>
              <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded ${
                notificationPermission === 'granted'
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : notificationPermission === 'denied'
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
                {notificationPermission.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                SW: {swStatus.isRegistered ? 'ACTIVE (/sw.js)' : 'INITIALIZING'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {language === 'en'
                ? 'Monitors approaching blood donation appointments and alerts you even when browser is minimized'
                : 'আসন্ন রক্তদান অ্যাপয়েন্টমেন্ট পর্যবেক্ষণ করে এবং ব্রাউজার মিনিমাইজ থাকলেও অ্যালার্ট পাঠায়'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {notificationPermission !== 'granted' ? (
            <button
              type="button"
              onClick={handleRequestNotificationPermission}
              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition-colors shrink-0"
            >
              {language === 'en' ? 'Enable Alerts' : 'সক্রিয় করুন'}
            </button>
          ) : (
            <button
              type="button"
              onClick={handleScanApproachingNow}
              disabled={isScanningApproaching}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition-all disabled:opacity-50 shrink-0"
              title="Trigger Service Worker scan for approaching blood donation dates"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanningApproaching ? 'animate-spin' : ''}`} />
              <span>{isScanningApproaching 
                ? (language === 'en' ? 'Scanning...' : 'স্ক্যানিং...') 
                : (language === 'en' ? 'Scan Approaching with SW' : 'SW দিয়ে স্ক্যান করুন')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Feedback Alert if any */}
      {notificationFeedback && (
        <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-blue-900 dark:text-blue-200 text-xs flex items-center justify-between">
          <span>{notificationFeedback}</span>
          <button onClick={() => setNotificationFeedback(null)} className="text-blue-500 hover:text-blue-700 ml-2">
            ✕
          </button>
        </div>
      )}

      {/* Schedule Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3.5 text-xs animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
            <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <CalendarPlus className="w-4 h-4 text-red-600" />
              {language === 'en' ? 'Set Future Blood Donation Appointment' : 'ভবিষ্যৎ রক্তদানের তারিখ নির্ধারণ করুন'}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              {currentUser.bloodGroup} Donor
            </span>
          </div>

          {/* Donation Type & Center */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Donation Type:' : 'রক্তদানের ধরণ:'}
              </label>
              <select
                value={donationType}
                onChange={(e) => setDonationType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                <option value="whole_blood">Whole Blood (হোল ব্লাড - ৩ মাস বিরতি)</option>
                <option value="platelets">Platelets / Apheresis (প্লাটিলেট - ১৪ দিন বিরতি)</option>
                <option value="plasma">Plasma (প্লাজমা - ২৮ দিন বিরতি)</option>
                <option value="double_red">Double Red Cells (লোহিত রক্তকণিকা - ৪ মাস বিরতি)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Hospital / Blood Bank:' : 'হাসপাতাল বা ব্লাড ব্যাংক:'}
              </label>
              <select
                value={hospitalOrCenter}
                onChange={(e) => setHospitalOrCenter(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-medium"
              >
                {centerOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Center Input */}
          {hospitalOrCenter === 'Other / Custom Location' && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Custom Center Name & Location:' : 'প্রতিষ্ঠানের নাম ও ঠিকানা লিখুন:'}
              </label>
              <input
                type="text"
                required
                value={customCenter}
                onChange={(e) => setCustomCenter(e.target.value)}
                placeholder="e.g. Uttara Crescent Hospital, Dhaka"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Appointment Date:' : 'নির্ধারিত তারিখ:'}
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                {language === 'en' ? 'Preferred Time Slot:' : 'পছন্দের সময়:'}
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
              />
            </div>
          </div>

          {/* Safety Cooldown Warning */}
          {isBeforeSafeDate && (
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <span className="font-bold block">
                  {language === 'en' ? 'Cooldown Warning:' : 'সতর্কতা:'}
                </span>
                {language === 'en'
                  ? `This date is earlier than your recommended medical cooldown (${safeNextDateString}). Ensure your hemoglobin and recovery are verified before donating.`
                  : `এই তারিখটি আপনার নির্ধারিত চিকিৎসা বিরতির (${safeNextDateString}) পূর্বে। রক্তদানের আগে চিকিৎসকের পরামর্শ গ্রহণ করুন।`}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              {language === 'en' ? 'Donor Preparation Notes:' : 'প্রস্তুতি সংক্রান্ত নোট:'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Drink 500ml water, avoid fatty foods 3 hours prior"
              className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
              <input
                type="checkbox"
                checked={reminderEnabled}
                onChange={(e) => setReminderEnabled(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
              />
              <span>
                {language === 'en' ? 'Enable local browser notification reminder' : 'স্থানীয় ব্রাউজার নোটিফিকেশন রিমাইন্ডার চালু রাখুন'}
              </span>
            </label>

            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold shadow-xs transition-colors"
            >
              {language === 'en' ? 'Save Appointment' : 'অ্যাপয়েন্টমেন্ট সংরক্ষণ'}
            </button>
          </div>
        </form>
      )}

      {/* List of Upcoming Appointments */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {language === 'en' ? 'Upcoming Appointments' : 'আসন্ন অ্যাপয়েন্টমেন্ট'} ({upcomingAppointments.length})
          </span>
          {upcomingAppointments.length > 0 && (
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {language === 'en' ? 'Active Reminders' : 'রিমাইন্ডার সক্রিয়'}
            </span>
          )}
        </div>

        {upcomingAppointments.length === 0 ? (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500">
            {language === 'en' 
              ? 'No upcoming blood donation appointments scheduled yet. Click "Schedule" above to set one.' 
              : 'বর্তমানে কোন নির্ধারিত রক্তদানের অ্যাপয়েন্টমেন্ট নেই। শিডিউল করতে উপরের বাটনে চাপুন।'}
          </div>
        ) : (
          upcomingAppointments.map((item) => (
            <div
              key={item.id}
              className="p-3.5 bg-slate-50/70 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5 hover:border-red-200 transition-all text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-white text-sm">
                      {item.hospitalOrCenter}
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-950 text-red-600 font-bold text-[10px] uppercase">
                      {item.donationType.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-red-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{item.scheduledDate}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.scheduledTime}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {item.reminderEnabled ? (
                    <span className="p-1.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 rounded-lg" title="Reminder Active">
                      <BellRing className="w-3.5 h-3.5" />
                    </span>
                  ) : (
                    <span className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-500 rounded-lg" title="Reminder Off">
                      <BellOff className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>
              </div>

              {item.notes && (
                <p className="text-[11px] text-slate-600 dark:text-slate-400 italic bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                  "{item.notes}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1.5">
                  {/* Test Browser Notification Trigger */}
                  <button
                    type="button"
                    onClick={() => handleSendTestReminder(item)}
                    className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                    title="Send test local browser notification right now"
                  >
                    <Bell className="w-3 h-3 text-red-600" />
                    <span>{language === 'en' ? 'Test Alert' : 'টেস্ট নোটিফিকেশন'}</span>
                  </button>

                  {/* Calendar Export */}
                  <button
                    type="button"
                    onClick={() => handleExportToCalendar(item)}
                    className="px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[11px] font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 transition-colors"
                    title="Download .ics Calendar File"
                  >
                    <Download className="w-3 h-3 text-blue-600" />
                    <span>.ICS</span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Mark as Completed */}
                  <button
                    type="button"
                    onClick={() => onUpdateScheduledStatus(item.id, 'completed')}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-xs transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Mark Donated' : 'রক্তদান সম্পন্ন'}</span>
                  </button>

                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={() => onDeleteScheduledDonation(item.id)}
                    className="px-2 py-1 text-slate-400 hover:text-rose-600 rounded-lg text-[11px] transition-colors"
                    title="Cancel Appointment"
                  >
                    {language === 'en' ? 'Cancel' : 'বাতিল'}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Past Completed History */}
      {pastAppointments.length > 0 && (
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {language === 'en' ? 'Past Scheduled Appointments' : 'পূর্ববর্তী অ্যাপয়েন্টমেন্ট ইতিহাস'}
          </span>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {pastAppointments.map((past) => (
              <div key={past.id} className="py-2 flex items-center justify-between text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-slate-900 dark:text-slate-200">{past.hospitalOrCenter}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({past.scheduledDate})</span>
                </div>
                <span className="px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                  {past.status.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
