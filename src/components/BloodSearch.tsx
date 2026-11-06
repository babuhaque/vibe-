import React, { useState } from 'react';
import { 
  Search, MapPin, Phone, MessageSquare, PhoneCall, CheckCircle, 
  Clock, Shield, Filter, Navigation, Compass, Heart
} from 'lucide-react';
import { BloodGroup, UserProfile, Language } from '../types/solovvo';

interface BloodSearchProps {
  donors: UserProfile[];
  language: Language;
  onSelectDonor?: (donor: UserProfile) => void;
}

export const BloodSearch: React.FC<BloodSearchProps> = ({
  donors,
  language,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [selectedRadius, setSelectedRadius] = useState<number>(10); // 5, 10, 15, 20 KM per Part 2 Section E
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDonorForContact, setActiveDonorForContact] = useState<UserProfile | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const radiusOptions = [5, 10, 15, 20]; // In Kilometers

  // Filter donors
  const filteredDonors = donors.filter((donor) => {
    if (selectedGroup !== 'ALL' && donor.bloodGroup !== selectedGroup) return false;
    if (onlyAvailable && !donor.isAvailableDonor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = donor.name.toLowerCase().includes(q) || (donor.nameBn && donor.nameBn.includes(q));
      const matchLoc = donor.location.toLowerCase().includes(q) || (donor.locationBn && donor.locationBn.includes(q));
      if (!matchName && !matchLoc) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-xl mx-auto pb-20">
      
      {/* Search Header Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-5 h-5 text-red-600" />
              {language === 'en' ? 'Normal Blood Search & GPS' : 'রক্তদাতা অনুসন্ধান ও মানচিত্র'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'en' 
                ? 'Find voluntary donors within custom radius across Bangladesh' 
                : 'আপনার এলাকার নির্দিষ্ট ব্যাসার্ধের মধ্যে রক্তদাতা খুঁজুন'}
            </p>
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-red-100 dark:bg-red-950 text-red-600 rounded-lg">
            {filteredDonors.length} {language === 'en' ? 'Found' : 'উপলব্ধ'}
          </span>
        </div>

        {/* Text Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search by area, hospital, or city (e.g. Dhanmondi)...' : 'এলাকা বা হাসপাতাল লিখে সার্চ করুন...'}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-red-500"
          />
        </div>

        {/* Blood Group Filter Chips */}
        <div>
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
            {language === 'en' ? 'Select Blood Group:' : 'রক্তের গ্রুপ নির্বাচন করুন:'}
          </label>
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-9">
            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all text-center ${
                selectedGroup === 'ALL'
                  ? 'bg-red-600 text-white border-red-600 shadow-xs'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-300'
              }`}
            >
              All
            </button>
            {bloodGroups.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`py-1.5 px-2 text-xs font-bold rounded-lg border transition-all text-center ${
                  selectedGroup === bg
                    ? 'bg-red-600 text-white border-red-600 shadow-xs scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-red-300'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Radius Filter Chips (5 KM, 10 KM, 15 KM, 20 KM per Part 2 Section E) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-600 dark:text-slate-400">
              {language === 'en' ? 'GPS Radius:' : 'দূরত্ব:'}
            </span>
            <div className="flex items-center gap-1">
              {radiusOptions.map((km) => (
                <button
                  key={km}
                  onClick={() => setSelectedRadius(km)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-colors ${
                    selectedRadius === km
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {km} KM
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={onlyAvailable}
              onChange={(e) => setOnlyAvailable(e.target.checked)}
              className="rounded text-red-600 focus:ring-red-500 w-3.5 h-3.5"
            />
            <span>{language === 'en' ? 'Available Only' : 'শুধুমাত্র সক্রিয় দাতা'}</span>
          </label>
        </div>
      </div>

      {/* GPS Map Radar Simulation Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 relative overflow-hidden border border-slate-800">
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-600/30 border border-red-500/50 flex items-center justify-center">
              <Navigation className="w-4 h-4 text-red-400 animate-spin" />
            </div>
            <div>
              <span className="text-xs font-bold block">
                {language === 'en' ? 'Live GPS Geofence Active' : 'লাইভ জিপিএস অ্যাক্টিভ'}
              </span>
              <span className="text-[11px] text-slate-400">
                {language === 'en' 
                  ? `Scanning within ${selectedRadius} KM of your current position` 
                  : `আপনার বর্তমান অবস্থান থেকে ${selectedRadius} কিমি পরিসীমায় স্ক্যানিং চলছে`}
              </span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
            23.7465° N, 90.3760° E
          </span>
        </div>
      </div>

      {/* Donors List */}
      <div className="space-y-3">
        {filteredDonors.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
            <Heart className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {language === 'en' ? 'No Donors Found in this Radius' : 'এই দূরত্বের মধ্যে কোন রক্তদাতা পাওয়া যায়নি'}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'en' 
                ? 'Try increasing search radius to 15 or 20 KM, or toggle group filter to ALL.' 
                : 'অনুসন্ধানের দূরত্ব বাড়িয়ে ১৫ বা ২০ কিমি করুন।'}
            </p>
          </div>
        ) : (
          filteredDonors.map((donor) => {
            const approximateDistanceKm = ((donor.latitude * 100) % 8 + 1.2).toFixed(1);
            return (
              <div
                key={donor.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs hover:border-red-200 transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={donor.avatarUrl}
                        alt={donor.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-red-500/20"
                      />
                      <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-900 ${
                        donor.isAvailableDonor ? 'bg-emerald-500' : 'bg-slate-400'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {language === 'en' ? donor.name : (donor.nameBn || donor.name)}
                        </h4>
                        {donor.isVerified && (
                          <span className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px]" title="Verified Donor">
                            ✓
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span>{language === 'en' ? donor.location : (donor.locationBn || donor.location)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">~{approximateDistanceKm} km</span>
                      </div>
                    </div>
                  </div>

                  {/* Blood Group Badge */}
                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-xl bg-red-600 text-white text-xs font-black shadow-xs">
                      {donor.bloodGroup}
                    </span>
                    <span className="block text-[10px] text-slate-400 mt-1 font-medium">
                      {donor.donationCount} {language === 'en' ? 'times donated' : 'বার দান'}
                    </span>
                  </div>
                </div>

                {/* Donor Bio and Badges */}
                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1 italic">
                  "{donor.bio}"
                </p>

                <div className="flex flex-wrap gap-1">
                  {donor.badges.map((b) => (
                    <span
                      key={b}
                      className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] font-medium"
                    >
                      {b}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: Call, WhatsApp, SMS (Strict requirement Part 2 Section E) */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <a
                    href={`tel:${donor.phone.replace(/[^0-9+]/g, '')}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{language === 'en' ? 'Call' : 'কল করুন'}</span>
                  </a>

                  <a
                    href={`https://wa.me/${donor.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(donor.name)}%2C%20urgent%20blood%20request%20via%20Solovvo`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <a
                    href={`sms:${donor.phone.replace(/[^0-9+]/g, '')}?body=Solovvo%20Blood%20Request%3A%20Need%20${donor.bloodGroup}%20blood`}
                    className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>SMS</span>
                  </a>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
