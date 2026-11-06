import React from 'react';
import { 
  Activity, Clock, MapPin, CheckCircle, AlertTriangle, UserCheck, 
  ChevronRight, Phone, MessageSquare
} from 'lucide-react';
import { EmergencyRequest, Language } from '../types/solovvo';

interface ActivityViewProps {
  requests: EmergencyRequest[];
  language: Language;
  onOpenEmergencyModal: () => void;
  onClaimRequest: (reqId: string) => void;
}

export const ActivityView: React.FC<ActivityViewProps> = ({
  requests,
  language,
  onOpenEmergencyModal,
  onClaimRequest,
}) => {
  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-red-600" />
            {language === 'en' ? 'My Activity & Emergency Requests' : 'আমার অ্যাক্টিভিটি ও জরুরী আবেদন'}
          </h2>
          <p className="text-xs text-slate-500">
            {language === 'en' 
              ? 'Track your submitted requests and committed donations' 
              : 'আপনার আবেদন ও প্রতিশ্রুত রক্তদানের অগ্রগতি ট্র্যাক করুন'}
          </p>
        </div>
        <button
          onClick={onOpenEmergencyModal}
          className="px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors shadow-xs"
        >
          {language === 'en' ? '+ New Request' : '+ নতুন আবেদন'}
        </button>
      </div>

      {/* Emergency Requests Stream */}
      <div className="space-y-3">
        {requests.map((req) => (
          <div
            key={req.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-red-600 text-white font-black text-xs">
                    {req.bloodGroup}
                  </span>
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {req.receiverName}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {req.id}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{req.hospitalName}</span>
                </div>
              </div>

              <div className="text-right">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  req.status === 'open'
                    ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                    : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {req.status.toUpperCase()}
                </span>
                <span className="block text-[11px] text-slate-400 mt-1 font-semibold">
                  {req.bagsFulfilled} / {req.bagsRequired} {language === 'en' ? 'Bags Confirmed' : 'ব্যাগ প্রস্তুত'}
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 space-y-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-medium">{req.requiredTime}</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed italic">
                "{req.notes}"
              </p>
            </div>

            {/* Response / Action Bar */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:${req.receiverPhone.replace(/[^0-9+]/g, '')}`}
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  title="Call Attendant"
                >
                  <Phone className="w-3.5 h-3.5 text-red-600" />
                </a>
                <a
                  href={`https://wa.me/${req.receiverPhone.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 transition-colors"
                  title="WhatsApp Attendant"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                </a>
              </div>

              {req.status === 'open' && req.bagsFulfilled < req.bagsRequired ? (
                <button
                  onClick={() => onClaimRequest(req.id)}
                  className="flex-1 max-w-[200px] py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Commit to Donate' : 'রক্তদানে সম্মতি দিন'}</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {language === 'en' ? 'Reserved / Fulfilled' : 'সংরক্ষিত / সফল'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
