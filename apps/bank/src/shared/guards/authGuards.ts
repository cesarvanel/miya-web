import { createAuthGuards } from '@miya/kernel';
import { AuthStatus, BankUserRole, authSelectors } from '@/modules/auth';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';
import { ForbiddenPage } from '@/shared/pages/ForbiddenPage';

export const { RequireAuth, RequireRole } = createAuthGuards<BankUserRole>({
  useAuthStatus: () => useBankSelector(authSelectors.selectAuthStatus),
  anonymousStatus: AuthStatus.Anonymous,
  loginPath: '/login',
  useRole: () => useBankSelector(authSelectors.selectCurrentRole),
  ForbiddenPage,
  noRoleFallbackPath: '/',
});
