import React from 'react';
import { 
  Bell, Heart, MessageCircle, AlertTriangle, Award, CheckCircle, 
  Calendar, Droplet, Clock
} from 'lucide-react';
import { Language } from '../types/solovvo';

interface NotificationCenterProps {
  language: Language;
  onOpenEmergencyModal: () => void;
  onOpenSecurityAudit: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  language,
  onOpenEmergencyModal,
  onOpenSecurityAudit,
}) => {
  const notifications = [
    {
      id: 'notif_1',
      type: 'emergency',
      title: language === 'en' ? 'URGENT: O+ Blood Needed at DMCH' : 'জরুরী: ডিএমসিএইচ এ ও+ রক্তের প্রয়োজন',
      desc: language === 'en' ? 'A patient requires 2 bags for emergency C-section within 3 hours.' : 'জরুরী সি-সেকশনের জন্য ৩ ঘণ্টার মধ্যে ২ ব্যাগ ও+ রক্ত প্রয়োজন।',
      time: '10 mins ago',
      unread: true,
      icon: Droplet,
      iconColor: 'text-red-600 bg-red-100 dark:bg-red-950',
    },
    {
      id: 'notif_2',
      type: 'achievement',
      title: language === 'en' ? 'New Achievement Unlocked: Life Saver 5+' : 'নতুন সম্মাননা: লাইফ সেভার ৫+',
      desc: language === 'en' ? 'Congratulations! You have verified 7 life-saving donations in Solovvo.' : 'অভিনন্দন! আপনি সোলোভোতে ৭টি সফল রক্তদান সম্পন্ন করেছেন।',
      time: '1 hour ago',
      unread: true,
      icon: Award,
      iconColor: 'text-amber-600 bg-amber-100 dark:bg-amber-950',
    },
    {
      id: 'notif_3',
      type: 'social',
      title: language === 'en' ? 'Dr. Nusrat Jahan liked your comment' : 'ডাঃ নুসরাত জাহান আপনার মন্তব্যে লাইক দিয়েছেন',
      desc: '"Inspirational work Apa! Keep inspiring the young generation."',
      time: '2 hours ago',
      unread: false,
      icon: Heart,
      iconColor: 'text-rose-600 bg-rose-100 dark:bg-rose-950',
    },
    {
      id: 'notif_4',
      type: 'reminder',
      title: language === 'en' ? 'Medical Eligibility Reminder' : 'মেডিকেল যোগ্যতা সতর্কতা',
      desc: language === 'en' ? 'Your 90-day cooldown period is complete. You are physically ready to donate blood.' : 'আপনার ৯০ দিনের স্বাস্থ্য বিরতি সম্পন্ন হয়েছে। আপনি এখন রক্তদান করতে সক্ষম।',
      time: '1 day ago',
      unread: false,
      icon: Calendar,
      iconColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950',
    },
    {
      id: 'notif_5',
      type: 'security',
      title: language === 'en' ? 'Security Audit: Stage 3.0.7 Report Ready' : 'সিকিউরিটি অডিট: স্টেজ ৩.০.৭ প্রস্তুত',
      desc: language === 'en' ? '5 audited security vulnerabilities verified with review-only zero-mutation tests.' : '৫টি সিকিউরিটি ভেরিফিকেশন পয়েন্ট সম্পূর্ণ যাচাই করা হয়েছে।',
      time: 'Just now',
      unread: true,
      icon: CheckCircle,
      iconColor: 'text-blue-600 bg-blue-100 dark:bg-blue-950',
      action: onOpenSecurityAudit,
    }
  ];

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-red-600" />
            {language === 'en' ? 'Notifications & Alerts' : 'বিজ্ঞপ্তি ও সতর্কতা'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'en' 
              ? 'Emergency blood alerts, donor responses, and badges' 
              : 'জরুরী রক্তের সতর্কতা, রক্তদাতার সাড়া এবং ব্যাজ'}
          </p>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950 text-red-600">
          3 New
        </span>
      </div>

      {/* Notifications List */}
      <div className="space-y-2.5">
        {notifications.map((n) => {
          const IconComp = n.icon;
          return (
            <div
              key={n.id}
              onClick={n.action}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                n.unread
                  ? 'bg-white dark:bg-slate-900 border-red-200 dark:border-slate-700 shadow-xs'
                  : 'bg-slate-50/70 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 opacity-90'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${n.iconColor}`}>
                <IconComp className="w-5 h-5" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {n.title}
                  </h4>
                  <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {n.desc}
                </p>
              </div>

              {n.unread && (
                <span className="w-2 h-2 rounded-full bg-red-600 shrink-0 mt-1" />
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
