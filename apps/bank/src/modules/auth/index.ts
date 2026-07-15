import { AuthSelectors } from './domain/selectors/Selectors';
import { authSlice } from './domain/slices/AuthSlice';

// Types de domaine
export { BankUserRole } from './domain/entities/Session';
export type { Session, SessionBank, SessionUser } from './domain/entities/Session';
export { AuthStatus } from './domain/slices/AuthSlice';
export type { LoginError, BankSelectionPending } from './domain/slices/AuthSlice';
export { PasswordStrengthLabel, checkPasswordStrength } from './domain/services/PasswordStrength';
export type { PasswordCriterion, PasswordStrength } from './domain/services/PasswordStrength';

// Reducer (branché dans RootReducer)
export const authReducer = authSlice.reducer;

// Actions plates (événement cross-module : sessionExpired via l'intercepteur HTTP,
// sessionUserUpdated consommé par le module profile après une édition d'identité)
export const AuthActions = authSlice.actions;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const authSelectors = {
  ...AuthSelectors,
};

// Use cases
export { LoginAsync } from './application/usecases/login-async/LoginAsync';
export type { LoginCommand } from './application/usecases/login-async/LoginCommand';
export type { LoginResponse } from './application/usecases/login-async/LoginResponse';

export { SelectBankAsync } from './application/usecases/select-bank-async/SelectBankAsync';
export type { SelectBankCommand } from './application/usecases/select-bank-async/SelectBankCommand';

export { LogoutAsync } from './application/usecases/logout-async/LogoutAsync';

export { RequestPasswordResetAsync } from './application/usecases/request-password-reset-async/RequestPasswordResetAsync';
export type { RequestPasswordResetCommand } from './application/usecases/request-password-reset-async/RequestPasswordResetCommand';

export { CheckResetTokenAsync } from './application/usecases/check-reset-token-async/CheckResetTokenAsync';

export { ResetPasswordAsync } from './application/usecases/reset-password-async/ResetPasswordAsync';
export type { ResetPasswordCommand } from './application/usecases/reset-password-async/ResetPasswordCommand';

export { RefreshSessionAsync } from './application/usecases/refresh-session-async/RefreshSessionAsync';

// Ports (types utilisés par la composition root)
export type { AuthDependencies } from './application/ports/AuthDependencies';
export type { AuthGateway, LoginCredentials, LoginOutcome, ResetTokenCheck } from './application/ports/AuthGateway';

// Infrastructure (instanciée par la composition root)
export { FakeAuthGateway } from './infrastructure/gateways/FakeAuthGateway';
export { AuthRouter } from './infrastructure/router/AuthRouter';
export { AuthRoutes } from './infrastructure/router/AuthRoutes';
export { SessionExpiredModal } from './infrastructure/views/modal/SessionExpiredModal';
export { ConfirmLogoutModal } from './infrastructure/views/modal/ConfirmLogoutModal';
export { PasswordStrengthGauge } from './infrastructure/views/composants/PasswordStrengthGauge';
