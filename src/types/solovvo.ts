export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';

export type Language = 'en' | 'bn';

export interface UserProfile {
  id: string;
  name: string;
  nameBn?: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  location: string;
  locationBn?: string;
  latitude: number;
  longitude: number;
  isAvailableDonor: boolean;
  lastDonationDate: string; // ISO date
  donationIntervalDays: number; // Configurable medical interval (default 90)
  donationCount: number;
  avatarUrl: string;
  coverUrl: string;
  badges: string[];
  bio: string;
  isVerified: boolean;
  role: 'donor' | 'recipient' | 'admin';
}

export interface EmergencyRequest {
  id: string;
  receiverName: string;
  receiverPhone: string;
  bloodGroup: BloodGroup;
  bagsRequired: number;
  bagsFulfilled: number;
  requiredTime: string;
  hospitalName: string;
  hospitalAddress: string;
  latitude: number;
  longitude: number;
  urgencyLevel: 'critical' | 'high' | 'normal';
  status: 'open' | 'matching' | 'reserved' | 'fulfilled' | 'expired' | 'cancelled';
  notes: string;
  createdAt: string;
  expiresAt: string;
  claimedByDonorIds: string[];
}

export interface DonorResponse {
  id: string; // composite or subcollection doc ID
  requestId: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorBloodGroup: BloodGroup;
  status: 'accepted' | 'rejected' | 'pending';
  estimatedArrivalMinutes?: number;
  responseTimestamp: string;
  hospitalConfirmed?: boolean;
}

export interface SocialPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorBloodGroup: BloodGroup;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  tag?: 'Emergency' | 'Donation Story' | 'Awareness' | 'Blood Camp';
  comments?: {
    id: string;
    userName: string;
    avatar: string;
    text: string;
    timeAgo: string;
  }[];
}

export interface SecurityAuditIssue {
  id: number;
  title: string;
  category: 'ID Ambiguity' | 'Concurrency' | 'Data Validation' | 'Failure Masking' | 'Testing Evidence';
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  vulnerableCode: string;
  secureCode: string;
  impactAnalysis: string;
  sparkPlanConsiderations: string;
  verificationStatus: 'VERIFIED_VULNERABLE' | 'MITIGATION_DESIGNED' | 'TESTED_READY';
}

export interface SecurityTestCase {
  id: string;
  name: string;
  category: string;
  testVector: string;
  expectedResult: 'PERMISSION_DENIED' | 'SUCCESS' | 'TRANSACTION_RETRY';
  actualResult: 'PERMISSION_DENIED' | 'SUCCESS' | 'TRANSACTION_RETRY';
  status: 'PASSED' | 'FAILED';
  executionTimeMs: number;
  description: string;
}
