import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Session, SessionBank, SessionUser } from '../entities/Session';
import { LoginAsync } from '../../application/usecases/login-async/LoginAsync';
import { LogoutAsync } from '../../application/usecases/logout-async/LogoutAsync';
import { RefreshSessionAsync } from '../../application/usecases/refresh-session-async/RefreshSessionAsync';
import { SelectBankAsync } from '../../application/usecases/select-bank-async/SelectBankAsync';

export const AuthStatus = {
  Anonymous: 'Anonymous',
  Authenticating: 'Authenticating',
  Authenticated: 'Authenticated',
  SessionExpired: 'SessionExpired',
} as const;
export type AuthStatus = (typeof AuthStatus)[keyof typeof AuthStatus];

export interface LoginError {
  message: string;
  remainingAttempts?: number;
}

export interface BankSelectionPending {
  user: SessionUser;
  banks: SessionBank[];
}

const initialState = {
  status: AuthStatus.Anonymous as AuthStatus,
  session: null as Session | null,
  loginError: null as LoginError | null,
  bankSelection: null as BankSelectionPending | null,
};

export type AuthState = typeof initialState;

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Dispatchée par l'intercepteur HTTP (401) ou le bouton de dev — capturable de n'importe où. */
    sessionExpired: (state) => {
      if (state.status === AuthStatus.Authenticated) {
        state.status = AuthStatus.SessionExpired;
      }
    },
    /** Édition du profil (module profile) — garde la session synchronisée avec l'identité affichée partout. */
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
          state.bankSelection = null;
        } else if (outcome.kind === 'SelectBank') {
          state.status = AuthStatus.Anonymous;
          state.bankSelection = { user: outcome.user, banks: outcome.banks };
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
      .addCase(SelectBankAsync.fulfilled, (state, action) => {
        state.status = AuthStatus.Authenticated;
        state.session = action.payload.session;
        state.bankSelection = null;
        state.loginError = null;
      })
      .addCase(LogoutAsync.fulfilled, () => initialState)
      .addCase(RefreshSessionAsync.fulfilled, (state, action) => {
        state.session = action.payload.session;
        state.status = AuthStatus.Authenticated;
      });
  },
});

export const AuthActions = authSlice.actions;
