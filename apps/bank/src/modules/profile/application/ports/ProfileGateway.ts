import type { ActiveSession, NotificationPreferences, ProfilePreferences, RecentAction } from '../../domain/entities/Profile';

export interface ProfileSnapshot {
  memberSince: string;
  preferences: ProfilePreferences;
  activeSessions: ActiveSession[];
  myRecentActions: RecentAction[];
}

export interface PersonalInfoInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface ProfileGateway {
  fetchProfile: (userId: string) => Promise<ProfileSnapshot>;
  updatePersonalInfo: (changes: PersonalInfoInput) => Promise<void>;
  changePassword: (current: string, next: string) => Promise<void>;
  updateNotificationPrefs: (prefs: NotificationPreferences) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
}
