import React, { useState, useEffect } from 'react';
import { 
  currentUser as initialCurrentUser, 
  initialDonors, 
  initialEmergencyRequests, 
  initialSocialPosts,
  initialScheduledDonations,
  initialDonationHistoryRecords
} from './data/mockData';
import { UserProfile, EmergencyRequest, SocialPost, Language, ScheduledDonation, DonationHistoryRecord } from './types/solovvo';
import { Header } from './components/Header';
import { BottomNav, TabType } from './components/BottomNav';
import { SocialFeed } from './components/SocialFeed';
import { BloodSearch } from './components/BloodSearch';
import { DonorManagement } from './components/DonorManagement';
import { ActivityView } from './components/ActivityView';
import { NotificationCenter } from './components/NotificationCenter';
import { SecurityAuditModal } from './components/SecurityAuditModal';
import { EmergencyRequestModal } from './components/EmergencyRequestModal';
import { ThreeDotMenuModal } from './components/ThreeDotMenuModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { onServiceWorkerNotificationClick } from './utils/serviceWorkerManager';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialCurrentUser);
  const [donors, setDonors] = useState<UserProfile[]>(initialDonors);
  const [emergencyRequests, setEmergencyRequests] = useState<EmergencyRequest[]>(initialEmergencyRequests);
  const [posts, setPosts] = useState<SocialPost[]>(initialSocialPosts);
  const [scheduledDonations, setScheduledDonations] = useState<ScheduledDonation[]>(initialScheduledDonations);
  const [donationHistoryRecords, setDonationHistoryRecords] = useState<DonationHistoryRecord[]>(initialDonationHistoryRecords);
  
  // Navigation & Modal states
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [language, setLanguage] = useState<Language>('en');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const [isSecurityAuditOpen, setIsSecurityAuditOpen] = useState<boolean>(false);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState<boolean>(false);
  const [isThreeDotOpen, setIsThreeDotOpen] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);

  // Handle incoming Service Worker notification clicks
  useEffect(() => {
    // If launched via notification click query param
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'account' || tabParam === 'activity' || tabParam === 'notifications') {
        setActiveTab(tabParam as TabType);
      }
    }

    // Subscribe to postMessage events from the Service Worker
    const unsubscribe = onServiceWorkerNotificationClick((appointmentId) => {
      console.log('[App] Navigating to account for appointment:', appointmentId);
      setActiveTab('account');
    });

    return () => unsubscribe();
  }, []);

  // Social feed handlers
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  const handleSavePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, isSaved: !p.isSaved };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string, commentText: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const newComment = {
          id: `c_${Date.now()}`,
          userName: currentUser.name,
          avatar: currentUser.avatarUrl,
          text: commentText,
          timeAgo: 'Just now'
        };
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...(p.comments || []), newComment]
        };
      }
      return p;
    }));
  };

  const handleCreatePost = (content: string, imageUrl?: string, tag?: SocialPost['tag']) => {
    const newPost: SocialPost = {
      id: `post_${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatarUrl,
      authorBloodGroup: currentUser.bloodGroup,
      timeAgo: 'Just now',
      content,
      imageUrl,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: false,
      isSaved: false,
      tag: tag || 'Donation Story',
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(prev => prev.filter(p => p.id !== postId));
  };

  // Donor management handlers
  const handleUpdateAvailability = (available: boolean) => {
    setCurrentUser(prev => ({ ...prev, isAvailableDonor: available }));
  };

  const handleUpdateIntervalDays = (days: number) => {
    setCurrentUser(prev => ({ ...prev, donationIntervalDays: days }));
  };

  // Emergency request handlers
  const handleCreateEmergencyRequest = (reqData: Omit<EmergencyRequest, 'id' | 'createdAt' | 'expiresAt' | 'claimedByDonorIds' | 'bagsFulfilled'>) => {
    const newReq: EmergencyRequest = {
      ...reqData,
      id: `req_emg_${Math.floor(Math.random() * 9000) + 1000}`,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      bagsFulfilled: 0,
      claimedByDonorIds: []
    };
    setEmergencyRequests([newReq, ...emergencyRequests]);
  };

  // Atomic commitment simulation
  const handleClaimRequest = (reqId: string) => {
    setEmergencyRequests(prev => prev.map(r => {
      if (r.id === reqId && r.bagsFulfilled < r.bagsRequired) {
        const newFulfilled = r.bagsFulfilled + 1;
        return {
          ...r,
          bagsFulfilled: newFulfilled,
          status: newFulfilled >= r.bagsRequired ? 'reserved' : 'open',
          claimedByDonorIds: [...r.claimedByDonorIds, currentUser.id]
        };
      }
      return r;
    }));
    alert(language === 'en' 
      ? 'Donation commitment recorded! Hospital attendant has been alerted.' 
      : 'রক্তদানের প্রতিশ্রুতি নিবন্ধিত হয়েছে! হাসপাতাল প্রতিনিধিকে জানানো হয়েছে।');
  };

  // Donation scheduler handlers
  const handleAddScheduledDonation = (donationData: Omit<ScheduledDonation, 'id' | 'createdAt'>) => {
    const newAppointment: ScheduledDonation = {
      ...donationData,
      id: `sch_don_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setScheduledDonations(prev => [newAppointment, ...prev]);
  };

  const handleUpdateScheduledStatus = (id: string, status: ScheduledDonation['status']) => {
    setScheduledDonations(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status };
      }
      return s;
    }));

    if (status === 'completed') {
      const todayIso = new Date().toISOString().split('T')[0];
      setCurrentUser(prev => ({
        ...prev,
        donationCount: prev.donationCount + 1,
        lastDonationDate: todayIso,
        badges: prev.donationCount + 1 >= 8 && !prev.badges.includes('Hero Donor (8+)')
          ? [...prev.badges, 'Hero Donor (8+)']
          : prev.badges
      }));
      alert(language === 'en'
        ? '🎉 Congratulations! Your verified blood donation has been recorded. Your medical interval recovery countdown has restarted.'
        : '🎉 অভিনন্দন! আপনার সফল রক্তদান লিপিবদ্ধ হয়েছে। স্বাস্থ্য বিরতির কাউন্টডাউন পুনর্নির্ধারিত করা হয়েছে।');
    }
  };

  const handleDeleteScheduledDonation = (id: string) => {
    setScheduledDonations(prev => prev.filter(s => s.id !== id));
  };

  // Donation history record handler
  const handleAddDonationRecord = (recordData: Omit<DonationHistoryRecord, 'id' | 'certificateId' | 'verifiedDate'>) => {
    const certId = `SOL-CERT-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const newRecord: DonationHistoryRecord = {
      ...recordData,
      id: `dh_rec_${Date.now()}`,
      certificateId: certId,
      verifiedDate: new Date().toISOString(),
    };
    setDonationHistoryRecords(prev => [newRecord, ...prev]);

    // Update currentUser stats: increment donation count, update lastDonationDate, check badge thresholds
    const newCount = currentUser.donationCount + recordData.units;
    const updatedBadges = [...currentUser.badges];
    if (newCount >= 8 && !updatedBadges.includes('Hero Donor (8+)')) {
      updatedBadges.push('Hero Donor (8+)');
    }
    if (newCount >= 10 && !updatedBadges.includes('Life Saver (10+)')) {
      updatedBadges.push('Life Saver (10+)');
    }
    if (newCount >= 25 && !updatedBadges.includes('Platinum Donor (25+)')) {
      updatedBadges.push('Platinum Donor (25+)');
    }

    setCurrentUser(prev => ({
      ...prev,
      donationCount: newCount,
      lastDonationDate: recordData.donationDate,
      badges: updatedBadges
    }));

    alert(language === 'en'
      ? `🩸 Verified donation logged successfully! Life-saving certificate ${certId} issued.`
      : `🩸 সফল রক্তদান লিপিবদ্ধ হয়েছে! জীবন রক্ষাকারী সার্টিফিকেট ${certId} ইস্যু করা হয়েছে।`);
  };

  const emergencyCount = emergencyRequests.filter(r => r.status === 'open').length;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onOpenThreeDotMenu={() => setIsThreeDotOpen(true)}
        onOpenSecurityAudit={() => setIsSecurityAuditOpen(true)}
        emergencyCount={emergencyCount}
        onOpenEmergencyView={() => setActiveTab('activity')}
      />

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-3 sm:px-4 pt-4">
        {activeTab === 'home' && (
          <SocialFeed
            posts={posts}
            currentUser={currentUser}
            language={language}
            onLikePost={handleLikePost}
            onSavePost={handleSavePost}
            onAddComment={handleAddComment}
            onCreatePost={handleCreatePost}
            onDeletePost={handleDeletePost}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
          />
        )}

        {activeTab === 'search' && (
          <BloodSearch
            donors={donors}
            language={language}
          />
        )}

        {activeTab === 'activity' && (
          <ActivityView
            requests={emergencyRequests}
            language={language}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onClaimRequest={handleClaimRequest}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationCenter
            language={language}
            onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
            onOpenSecurityAudit={() => setIsSecurityAuditOpen(true)}
          />
        )}

        {activeTab === 'account' && (
          <DonorManagement
            currentUser={currentUser}
            scheduledDonations={scheduledDonations}
            donationHistoryRecords={donationHistoryRecords}
            language={language}
            onUpdateAvailability={handleUpdateAvailability}
            onUpdateIntervalDays={handleUpdateIntervalDays}
            onAddScheduledDonation={handleAddScheduledDonation}
            onUpdateScheduledStatus={handleUpdateScheduledStatus}
            onDeleteScheduledDonation={handleDeleteScheduledDonation}
            onAddDonationRecord={handleAddDonationRecord}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        language={language}
        unreadNotificationsCount={3}
        onOpenEmergencyModal={() => setIsEmergencyModalOpen(true)}
      />

      {/* Security Audit Modal (Stage 3.0.7 Verification) */}
      <SecurityAuditModal
        isOpen={isSecurityAuditOpen}
        onClose={() => setIsSecurityAuditOpen(false)}
        language={language}
      />

      {/* Emergency Blood Request Creation Modal */}
      <EmergencyRequestModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        language={language}
        onSubmitRequest={handleCreateEmergencyRequest}
      />

      {/* Three-Dot Options Modal */}
      <ThreeDotMenuModal
        isOpen={isThreeDotOpen}
        onClose={() => setIsThreeDotOpen(false)}
        language={language}
        onLanguageChange={setLanguage}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        onNavigateToTab={(tab) => setActiveTab(tab)}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        language={language}
      />

    </div>
  );
}
