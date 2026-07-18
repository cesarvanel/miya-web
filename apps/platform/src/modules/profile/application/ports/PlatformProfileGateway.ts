import type { ActiveSession, PlatformNotificationPreferences, ProfilePreferences } from '../../domain/entities/Profile';

export interface ProfileSnapshot {
  preferences: ProfilePreferences;
  activeSessions: ActiveSession[];
}

export interface PersonalInfoInput {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface PlatformProfileGateway {
  fetchProfile: (userId: string) => Promise<ProfileSnapshot>;
  updatePersonalInfo: (changes: PersonalInfoInput) => Promise<void>;
  /** Mêmes règles de robustesse mutualisées (kernel checkPasswordStrength) que la réinitialisation. */
  changePassword: (current: string, next: string) => Promise<void>;
  updateNotificationPrefs: (prefs: PlatformNotificationPreferences) => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
}
