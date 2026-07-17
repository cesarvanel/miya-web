import { createAuthGuards } from '@miya/kernel';
import { AuthRoutes, AuthStatus, PlatformUserRole, authSelectors } from '@/modules/auth';
import { usePlatformSelector } from '@/config/root-hook';
import { ForbiddenPage } from '@/shared/pages/ForbiddenPage';

export const { RequireAuth, RequireRole } = createAuthGuards<PlatformUserRole>({
  useAuthStatus: () => usePlatformSelector(authSelectors.selectAuthStatus),
  anonymousStatus: AuthStatus.Anonymous,
  loginPath: AuthRoutes.loginPath,
  useRole: () => usePlatformSelector(authSelectors.selectCurrentRole),
  ForbiddenPage,
  noRoleFallbackPath: '/',
});
