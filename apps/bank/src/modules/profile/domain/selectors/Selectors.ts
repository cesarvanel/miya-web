import type { BankRootState } from '@/config/stores/store';

export const selectMemberSince = (state: BankRootState): string | null => state.profile.memberSince;

export const selectNotificationPreferences = (state: BankRootState) => state.profile.preferences?.notifications ?? null;

export const selectActiveSessions = (state: BankRootState) => state.profile.activeSessions;

export const selectMyRecentActions = (state: BankRootState) => state.profile.myRecentActions;

export const ProfileSelectors = {
  selectMemberSince,
  selectNotificationPreferences,
  selectActiveSessions,
  selectMyRecentActions,
};
