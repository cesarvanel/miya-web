import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActiveSession, PlatformNotificationPreferences, ProfilePreferences } from '../entities/Profile';
import { FetchProfileAsync } from '../../application/usecases/fetch-profile-async/FetchProfileAsync';
import { RevokeSessionAsync } from '../../application/usecases/revoke-session-async/RevokeSessionAsync';
import { UpdateNotificationPrefsAsync } from '../../application/usecases/update-notification-prefs-async/UpdateNotificationPrefsAsync';

const initialState = {
  preferences: null as ProfilePreferences | null,
  activeSessions: [] as ActiveSession[],
};

export type ProfileState = typeof initialState;

/**
 * profile.slice — ne stocke QUE préférences + sessions actives. Pas de
 * `myRecentActions` ici : dérivé en direct du journal d'audit du module
 * activity (domain/selectors/Selectors.ts), pour ne jamais dupliquer cette
 * source de vérité.
 */
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchProfileAsync.fulfilled, (state, action) => {
        state.preferences = action.payload.preferences;
        state.activeSessions = action.payload.activeSessions;
      })
      .addCase(UpdateNotificationPrefsAsync.fulfilled, (state, action: PayloadAction<PlatformNotificationPreferences>) => {
        if (state.preferences) {
          state.preferences.notifications = action.payload;
        }
      })
      .addCase(RevokeSessionAsync.fulfilled, (state, action) => {
        state.activeSessions = state.activeSessions.filter((session) => session.id !== action.payload.sessionId);
      });
  },
});
