import type { BankRootState } from '@/config/stores/store';
import { AuthStatus } from '../slices/AuthSlice';
import type { BankUserRole, Session, SessionBank, SessionUser } from '../entities/Session';

export const selectAuthStatus = (state: BankRootState): AuthStatus => state.auth.status;

export const selectSession = (state: BankRootState): Session | null => state.auth.session;

export const selectCurrentUser = (state: BankRootState): SessionUser | null => state.auth.session?.user ?? null;

export const selectCurrentRole = (state: BankRootState): BankUserRole | null => state.auth.session?.user.role ?? null;

export const selectCurrentBank = (state: BankRootState): SessionBank | null => state.auth.session?.bank ?? null;

export const selectIsAuthenticated = (state: BankRootState): boolean => state.auth.status === AuthStatus.Authenticated;

export const selectLoginError = (state: BankRootState) => state.auth.loginError;

export const selectBankSelectionPending = (state: BankRootState) => state.auth.bankSelection;

/** Nom affiché dans les attributions (« validé par », « by » du journal…) — jamais en dur ailleurs. */
export const selectCurrentUserDisplayName = (state: BankRootState): string => selectCurrentUser(state)?.fullName ?? 'Utilisateur';

export const AuthSelectors = {
  selectAuthStatus,
  selectSession,
  selectCurrentUser,
  selectCurrentRole,
  selectCurrentBank,
  selectIsAuthenticated,
  selectLoginError,
  selectBankSelectionPending,
  selectCurrentUserDisplayName,
};
