import React from 'react';
import { initialsOf } from '@miya/ui';
import { authSelectors, PlatformUserRole } from '@/modules/auth';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { openModal } from '@/shared/modals';
import { Sidebar } from '@/shared/layout/Sidebar';

const ROLE_LABEL: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'Super admin',
  [PlatformUserRole.ReadOnly]: 'Lecture seule',
};

/**
 * Composition root : lit l'utilisateur courant dans l'index public du
 * module auth et le passe à la `Sidebar`, qui reste un composant de layout
 * pur — aucun accès store depuis `shared/`. Pas de badges cette passe
 * (tenants/billing/activity restent des stubs sans compteur réel).
 */
export const SidebarContainer: React.FC = () => {
  const dispatch = usePlatformDispatch();
  const currentUser = usePlatformSelector(authSelectors.selectCurrentUser);

  if (!currentUser) {
    return null;
  }

  return (
    <Sidebar
      user={{
        name: currentUser.fullName,
        caption: ROLE_LABEL[currentUser.role],
        initials: initialsOf(currentUser.fullName),
      }}
      onLogout={() => dispatch(openModal({ type: 'confirmLogout', props: undefined }))}
    />
  );
};
