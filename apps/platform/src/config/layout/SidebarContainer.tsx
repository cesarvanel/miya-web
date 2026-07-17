import React, { useEffect } from 'react';
import { initialsOf } from '@miya/ui';
import { authSelectors, PlatformUserRole } from '@/modules/auth';
import { billingSelectors, FetchBillingAsync } from '@/modules/billing';
import { FetchTenantsAsync, tenantsSelectors } from '@/modules/tenants';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { openModal } from '@/shared/modals';
import { Sidebar, type SidebarBadge } from '@/shared/layout/Sidebar';

const ROLE_LABEL: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'Super admin',
  [PlatformUserRole.ReadOnly]: 'Lecture seule',
};

/**
 * Composition root : lit l'utilisateur courant dans l'index public du
 * module auth et le passe à la `Sidebar`, qui reste un composant de layout
 * pur — aucun accès store depuis `shared/`. Badge « Banques » branché sur le
 * nombre réel de tenants ; badge « Abonnements » sur les factures en retard
 * (activity reste un stub sans compteur).
 */
export const SidebarContainer: React.FC = () => {
  const dispatch = usePlatformDispatch();
  const currentUser = usePlatformSelector(authSelectors.selectCurrentUser);
  const tenantsCount = usePlatformSelector(tenantsSelectors.selectTenantsFilterCounts).all;
  const overdueInvoicesCount = usePlatformSelector(billingSelectors.selectOverdueCount);

  useEffect(() => {
    dispatch(FetchTenantsAsync());
    dispatch(FetchBillingAsync());
  }, [dispatch]);

  if (!currentUser) {
    return null;
  }

  const badges: Partial<Record<string, SidebarBadge>> = {
    '/tenants': { count: tenantsCount, tone: 'neutral' },
    '/billing': { count: overdueInvoicesCount, tone: 'danger' },
  };

  return (
    <Sidebar
      badges={badges}
      user={{
        name: currentUser.fullName,
        caption: ROLE_LABEL[currentUser.role],
        initials: initialsOf(currentUser.fullName),
      }}
      onLogout={() => dispatch(openModal({ type: 'confirmLogout', props: undefined }))}
    />
  );
};
