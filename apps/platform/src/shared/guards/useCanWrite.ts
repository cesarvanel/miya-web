import { authSelectors, PlatformUserRole } from '@/modules/auth';
import { usePlatformSelector } from '@/config/root-hook';

/**
 * Rôle ReadOnly → toute l'app platform passe en lecture seule. Consommé par
 * les boutons d'action de TOUS les modules (tenants, billing, activity,
 * settings-platform) — pas seulement celui qui gère les rôles.
 */
export const useCanWrite = (): boolean => {
  const role = usePlatformSelector(authSelectors.selectCurrentRole);
  return role === PlatformUserRole.Owner;
};
