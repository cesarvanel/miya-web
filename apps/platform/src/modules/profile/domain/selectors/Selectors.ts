import { createSelector } from '@reduxjs/toolkit';
import { activitySelectors } from '@/modules/activity';
import { authSelectors } from '@/modules/auth';
import type { PlatformRootState } from '@/config/store';

export const selectPreferences = (state: PlatformRootState) => state.profile.preferences;

export const selectNotificationPreferences = (state: PlatformRootState) => state.profile.preferences?.notifications ?? null;

export const selectActiveSessions = (state: PlatformRootState) => state.profile.activeSessions;

/**
 * Journal personnel — DÉRIVÉ du journal d'audit du module activity (via son
 * index public), filtré sur l'acteur courant (auth.currentUser). Aucune
 * seconde source d'actions : pas de state propre à ce module pour ça.
 */
export const selectMyRecentActions = createSelector(
  [activitySelectors.selectAllAuditEntries, authSelectors.selectCurrentUser],
  (entries, currentUser) => (currentUser ? entries.filter((entry) => entry.actor.id === currentUser.id) : []),
);

export const ProfileSelectors = {
  selectPreferences,
  selectNotificationPreferences,
  selectActiveSessions,
  selectMyRecentActions,
};
