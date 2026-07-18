import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Session, SessionUser } from '../entities/Session';
import { LoginAsync } from '../../application/usecases/login-async/LoginAsync';
import { LogoutAsync } from '../../application/usecases/logout-async/LogoutAsync';

export const AuthStatus = {
  Anonymous: 'Anonymous',
  Authenticating: 'Authenticating',
  Authenticated: 'Authenticated',
} as const;
export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];

export interface LoginError {
  message: string;
  remainingAttempts?: number;
}

const initialState = {
  status: AuthStatus.Anonymous as AuthStatus,
  session: null as Session | null,
  loginError: null as LoginError | null,
};

export type AuthState = typeof initialState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Édition du profil (module profile) — garde la session synchronisée avec l'identité affichée partout (sidebar…). */
    sessionUserUpdated: (state, action: PayloadAction<Partial<SessionUser>>) => {
      if (state.session) {
        state.session.user = { ...state.session.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(LoginAsync.pending, (state) => {
        state.status = AuthStatus.Authenticating;
        state.loginError = null;
      })
      .addCase(LoginAsync.fulfilled, (state, action) => {
        const { outcome } = action.payload;
        if (outcome.kind === 'Success') {
          state.status = AuthStatus.Authenticated;
          state.session = outcome.session;
          state.loginError = null;
        } else {
          state.status = AuthStatus.Anonymous;
          state.loginError = { message: outcome.message, remainingAttempts: outcome.remainingAttempts };
        }
      })
      .addCase(LoginAsync.rejected, (state, action) => {
        state.status = AuthStatus.Anonymous;
        state.loginError = { message: action.payload?.message ?? 'Une erreur est survenue.' };
      })
      .addCase(LogoutAsync.fulfilled, () => initialState);
  },
});

export const AuthActions = authSlice.actions;
