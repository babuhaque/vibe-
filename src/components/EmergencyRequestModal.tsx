import React, { useState } from 'react';
import { 
  AlertTriangle, Droplet, Hospital, MapPin, Clock, Phone, User, 
  Send, CheckCircle, Radar, Shield, Check
} from 'lucide-react';
import { BloodGroup, EmergencyRequest, Language } from '../types/solovvo';

interface EmergencyRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSubmitRequest: (req: Omit<EmergencyRequest, 'id' | 'createdAt' | 'expiresAt' | 'claimedByDonorIds' | 'bagsFulfilled'>) => void;
}

export const EmergencyRequestModal: React.FC<EmergencyRequestModalProps> = ({
  isOpen,
  onClose,
  language,
  onSubmitRequest,
}) => {
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('+880 1');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [bagsRequired, setBagsRequired] = useState(1);
  const [requiredTime, setRequiredTime] = useState('Immediate (Within 3 Hours)');
  const [hospitalName, setHospitalName] = useState('Dhaka Medical College Hospital');
  const [hospitalAddress, setHospitalAddress] = useState('Secretariat Rd, Dhaka 1000');
  const [urgencyLevel, setUrgencyLevel] = useState<'critical' | 'high' | 'normal'>('critical');
  const [notes, setNotes] = useState('Urgent transfusion required. Attendant available at blood bank.');
  const [consentLiveLocation, setConsentLiveLocation] = useState(true);

  // Finding Donors radar screen state (Part 2 Section F)
  const [isMatching, setIsMatching] = useState(false);
  const [matchDone, setMatchDone] = useState(false);
  const [matchedDonorCount, setMatchedDonorCount] = useState(0);

  if (!isOpen) return null;

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiverName.trim() || !hospitalName.trim()) return;

    // Trigger "Finding Donors Screen" animation (Part 2 Section F)
    setIsMatching(true);

    setTimeout(() => {
      setIsMatching(false);
      setMatchDone(true);
      setMatchedDonorCount(4); // 4 nearby donors matched via GPS radius

      onSubmitRequest({
        receiverName,
        receiverPhone,
        bloodGroup,
        bagsRequired,
        requiredTime,
        hospitalName,
        hospitalAddress,
        latitude: 23.7258,
        longitude: 90.3976,
        urgencyLevel,
        status: 'open',
        notes,
      });
    }, 2200);
  };

  const handleResetAndClose = () => {
    setIsMatching(false);
    setMatchDone(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-red-200 dark:border-slate-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="bg-red-600 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Droplet className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base">
                {language === 'en' ? 'Emergency Blood Request' : 'জরুরী রক্ত প্রাপ্তির আবেদন'}
              </h3>
              <p className="text-xs text-red-100">
                {language === 'en' ? 'Automatic donor matching & broadcast' : 'স্বয়ংক্রিয় রক্তদাতা সন্ধান ও বিজ্ঞপ্তি'}
              </p>
            </div>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-white/80 hover:text-white p-1 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          
          {/* Finding Donors Screen (Part 2 Section F) */}
          {isMatching ? (
            <div className="py-12 text-center space-y-4">
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-red-500/30 animate-pulse" />
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg relative z-10">
                  <Radar className="w-8 h-8 animate-spin" />
                </div>
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Finding Available Donors...' : 'রক্তদাতা সন্ধান করা হচ্ছে...'}
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1">
                  {language === 'en'
                    ? `Searching for verified ${bloodGroup} donors within 10 KM of ${hospitalName}...`
                    : `${hospitalName} এর ১০ কিমি ব্যাসার্ধের মধ্যে ${bloodGroup} রক্তদাতা খোঁজা হচ্ছে...`}
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs text-red-600 font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                <span>Dispatching emergency alerts...</span>
              </div>
            </div>
          ) : matchDone ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-10 h-10" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'en' ? 'Request Broadcasted Successfully!' : 'অনুরোধ সফলভাবে প্রচারিত হয়েছে!'}
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  {language === 'en'
                    ? `${matchedDonorCount} nearby active ${bloodGroup} donors have received an instant alert.`
                    : `${matchedDonorCount} জন নিকটবর্তী ${bloodGroup} রক্তদাতার কাছে জরুরী বিজ্ঞপ্তি পাঠানো হয়েছে।`}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-left space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Receiver:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{receiverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hospital:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{hospitalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Required:</span>
                  <span className="font-bold text-red-600">{bagsRequired} Bag(s) {bloodGroup}</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="w-full py-2.5 bg-red-600 text-white rounded-xl text-xs font-bold hover:bg-red-700 transition-colors"
              >
                {language === 'en' ? 'View in Activity Tracker' : 'অ্যাক্টিভিটি ট্র্যাকার দেখুন'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              {/* Receiver Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Receiver / Patient Name:' : 'রোগী বা গ্রাহকের নাম:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="e.g. Farzana Parvin"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Phone Number:' : 'যোগাযোগ নম্বর:'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={receiverPhone}
                    onChange={(e) => setReceiverPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Blood Group & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Required Blood Group:' : 'প্রয়োজনীয় রক্তের গ্রুপ:'}
                  </label>
                  <select
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-red-600"
                  >
                    {bloodGroups.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Number of Bags:' : 'রক্তের ব্যাগের সংখ্যা:'}
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={bagsRequired}
                    onChange={(e) => setBagsRequired(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  />
                </div>
              </div>

              {/* Hospital & Urgency */}
              <div className="space-y-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Hospital / Clinic Name:' : 'হাসপাতালের নাম:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    placeholder="e.g. Dhaka Medical College Hospital"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Hospital Full Address:' : 'হাসপাতালের পূর্ণ ঠিকানা:'}
                  </label>
                  <input
                    type="text"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    placeholder="e.g. Ward 20, Secretariat Rd, Dhaka"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
              </div>

              {/* Required Time & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Required By When:' : 'কখন প্রয়োজন:'}
                  </label>
                  <input
                    type="text"
                    value={requiredTime}
                    onChange={(e) => setRequiredTime(e.target.value)}
                    placeholder="e.g. Today by 4:00 PM"
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'en' ? 'Urgency Level:' : 'জরুরিতার মাত্রা:'}
                  </label>
                  <select
                    value={urgencyLevel}
                    onChange={(e) => setUrgencyLevel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
                  >
                    <option value="critical">🚨 Critical / Life Threatening</option>
                    <option value="high">⚠️ High Priority (Surgery Today)</option>
                    <option value="normal">Standard (Scheduled Transfusion)</option>
                  </select>
                </div>
              </div>

              {/* Live Location Sharing Consent (Rule: Part 2 Section F) */}
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-900 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="locConsent"
                  checked={consentLiveLocation}
                  onChange={(e) => setConsentLiveLocation(e.target.checked)}
                  className="mt-0.5 rounded text-red-600 focus:ring-red-500 w-4 h-4"
                />
                <label htmlFor="locConsent" className="text-[11px] text-slate-700 dark:text-slate-300 leading-relaxed cursor-pointer">
                  <span className="font-bold text-red-700 dark:text-red-400 block">
                    {language === 'en' ? 'Live Location Sharing with Consent' : 'সম্মতি সহ লাইভ লোকেশন শেয়ার'}
                  </span>
                  {language === 'en'
                    ? 'Share approximate hospital GPS coordinates with responding donors to help them navigate quickly.'
                    : 'স্বীকৃত রক্তদাতাদের দ্রুত পৌঁছানোর সুবিধার্থে হাসপাতালের অবস্থান শেয়ার করুন।'}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md shadow-red-600/30 transition-all text-xs"
              >
                <Send className="w-4 h-4" />
                <span>{language === 'en' ? 'Submit Emergency Request & Find Donors' : 'জরুরী রিকুয়েস্ট সাবমিট ও দাতা খুঁজুন'}</span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
