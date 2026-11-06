import React, { useState } from 'react';
import { 
  Users, Heart, AlertOctagon, BarChart3, ShieldAlert, Check, X,
  FileText, Activity, ShieldCheck, Search
} from 'lucide-react';
import { initialEmergencyRequests, initialDonors } from '../data/mockData';
import { Language } from '../types/solovvo';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeSection, setActiveSection] = useState<'stats' | 'requests' | 'donors' | 'reports'>('stats');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[88vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600 rounded-xl text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Solovvo Admin &amp; Governance Console</h2>
              <p className="text-xs text-slate-400">Section J: Donor, Request &amp; Safety Monitoring</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">✕</button>
        </div>

        {/* Navigation Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-6 gap-2 text-xs font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveSection('stats')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 ${
              activeSection === 'stats'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Application Statistics
          </button>

          <button
            onClick={() => setActiveSection('requests')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 ${
              activeSection === 'requests'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            Emergency Requests ({initialEmergencyRequests.length})
          </button>

          <button
            onClick={() => setActiveSection('donors')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 ${
              activeSection === 'donors'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Donor &amp; Verification Management
          </button>

          <button
            onClick={() => setActiveSection('reports')}
            className={`py-3 px-3 border-b-2 flex items-center gap-2 ${
              activeSection === 'reports'
                ? 'border-red-600 text-red-600 dark:text-red-400'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Reports &amp; Fraud Prevention
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeSection === 'stats' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900">
                  <span className="text-2xl font-black text-red-600">1,248</span>
                  <span className="text-xs text-slate-500 block font-medium">Registered Donors</span>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900">
                  <span className="text-2xl font-black text-emerald-600">3,492</span>
                  <span className="text-xs text-slate-500 block font-medium">Fulfilled Bags</span>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
                  <span className="text-2xl font-black text-blue-600">98.4%</span>
                  <span className="text-xs text-slate-500 block font-medium">Emergency Response Rate</span>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900">
                  <span className="text-2xl font-black text-purple-600">14 min</span>
                  <span className="text-xs text-slate-500 block font-medium">Avg Donor Arrival Time</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Blood Group Inventory Distribution in Central Zone:
                </h4>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                  {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                    <div key={bg} className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                      <span className="font-extrabold text-red-600 block">{bg}</span>
                      <span className="text-[11px] text-slate-500">
                        {bg === 'O-' ? '🚨 4 Donors' : `${Math.floor(Math.random() * 40) + 15} Donors`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'requests' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Active Blood Broadcasts</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                {initialEmergencyRequests.map((req) => (
                  <div key={req.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">{req.receiverName}</span>
                        <span className="px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950 text-red-600 font-extrabold text-[10px]">
                          {req.bloodGroup} • {req.bagsRequired} Bag(s)
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {req.id}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{req.hospitalName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {req.status.toUpperCase()}
                      </span>
                      <button
                        onClick={() => alert(`Broadcasting reminder to verified ${req.bloodGroup} donors.`)}
                        className="px-2.5 py-1 bg-red-600 text-white rounded text-[11px] font-bold hover:bg-red-700"
                      >
                        Boost
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'donors' && (
            <div className="space-y-3 text-xs">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Volunteer Donor Verification Queue</h4>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {initialDonors.map((d) => (
                  <div key={d.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={d.avatarUrl} alt={d.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white block">{d.name} ({d.bloodGroup})</span>
                        <span className="text-[11px] text-slate-500">{d.location} • {d.donationCount} donations</span>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold">
                      VERIFIED MEDICAL BADGE
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-900 text-amber-900 dark:text-amber-200">
                <span className="font-bold block mb-1">Zero Commercial Blood Trading Policy</span>
                <p className="text-[11px]">
                  Solovvo algorithms flag any posts mentioning money, gift cards, or commercial brokers.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Flagged Post #FL-902</span>
                  <span className="text-[11px] text-slate-500">Automated sentiment filter detected phone number spam.</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => alert('Post removed and user warned.')} className="px-2.5 py-1 bg-red-600 text-white rounded font-bold">
                    Ban &amp; Purge
                  </button>
                  <button onClick={() => alert('Report dismissed.')} className="px-2.5 py-1 bg-slate-200 dark:bg-slate-700 rounded font-bold">
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold"
          >
            Close Admin Console
          </button>
        </div>

      </div>
    </div>
  );
};
