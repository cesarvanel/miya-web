import { AuthSelectors } from './domain/selectors/Selectors';
import { authSlice } from './domain/slices/AuthSlice';

// Types de domaine
export { PlatformUserRole } from './domain/entities/Session';
export type { Session, SessionUser } from './domain/entities/Session';
export { AuthStatus } from './domain/slices/AuthSlice';
export type { LoginError } from './domain/slices/AuthSlice';

// Reducer (branché dans root-reducer)
export const authReducer = authSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const authSelectors = {
  ...AuthSelectors,
};

// Use cases
export { LoginAsync } from './application/usecases/login-async/LoginAsync';
export type { LoginCommand } from './application/usecases/login-async/LoginCommand';
export type { LoginResponse } from './application/usecases/login-async/LoginResponse';

export { LogoutAsync } from './application/usecases/logout-async/LogoutAsync';

// Ports (types utilisés par la composition root)
export type { AuthDependencies } from './application/ports/AuthDependencies';
export type { AuthGateway, LoginCredentials, LoginOutcome } from './application/ports/AuthGateway';

// Infrastructure (instanciée par la composition root)
export { FakeAuthGateway } from './infrastructure/gateways/FakeAuthGateway';
export { AuthRouter } from './infrastructure/router/AuthRouter';
export { AuthRoutes } from './infrastructure/router/AuthRoutes';
export { ConfirmLogoutModal } from './infrastructure/views/modal/ConfirmLogoutModal';
