import type { PlatformRootState } from '@/config/store';
import { AuthStatus } from '../slices/AuthSlice';
import type { PlatformUserRole, Session, SessionUser } from '../entities/Session';

export const selectAuthStatus = (state: PlatformRootState): AuthStatus => state.auth.status;

export const selectSession = (state: PlatformRootState): Session | null => state.auth.session;

export const selectCurrentUser = (state: PlatformRootState): SessionUser | null => state.auth.session?.user ?? null;

export const selectCurrentRole = (state: PlatformRootState): PlatformUserRole | null => state.auth.session?.user.role ?? null;

export const selectIsAuthenticated = (state: PlatformRootState): boolean => state.auth.status === AuthStatus.Authenticated;

export const selectLoginError = (state: PlatformRootState) => state.auth.loginError;

/** Nom affiché dans la sidebar/le profil — jamais en dur ailleurs. */
export const selectCurrentUserDisplayName = (state: PlatformRootState): string => selectCurrentUser(state)?.fullName ?? 'Utilisateur';

export const AuthSelectors = {
  selectAuthStatus,
  selectSession,
  selectCurrentUser,
  selectCurrentRole,
  selectIsAuthenticated,
  selectLoginError,
  selectCurrentUserDisplayName,
};
