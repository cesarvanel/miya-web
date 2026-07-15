import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { ActiveSession, NotificationPreferences, ProfilePreferences, RecentAction } from '../entities/Profile';
import { FetchProfileAsync } from '../../application/usecases/fetch-profile-async/FetchProfileAsync';
import { RevokeSessionAsync } from '../../application/usecases/revoke-session-async/RevokeSessionAsync';
import { UpdateNotificationPrefsAsync } from '../../application/usecases/update-notification-prefs-async/UpdateNotificationPrefsAsync';

const initialState = {
  memberSince: null as string | null,
  preferences: null as ProfilePreferences | null,
  activeSessions: [] as ActiveSession[],
  myRecentActions: [] as RecentAction[],
};

export type ProfileState = typeof initialState;

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(FetchProfileAsync.fulfilled, (state, action) => {
        state.memberSince = action.payload.memberSince;
        state.preferences = action.payload.preferences;
        state.activeSessions = action.payload.activeSessions;
        state.myRecentActions = action.payload.myRecentActions;
      })
      .addCase(UpdateNotificationPrefsAsync.fulfilled, (state, action: PayloadAction<NotificationPreferences>) => {
        if (state.preferences) {
          state.preferences.notifications = action.payload;
        }
      })
      .addCase(RevokeSessionAsync.fulfilled, (state, action) => {
        state.activeSessions = state.activeSessions.filter((session) => session.id !== action.payload.sessionId);
      });
  },
});
