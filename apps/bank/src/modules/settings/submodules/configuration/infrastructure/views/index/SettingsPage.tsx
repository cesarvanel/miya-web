import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@miya/ui';
import { AdminShell, type AdminSecondaryNavItem } from '@/shared/layout/AdminShell';
import { CollectionRulesRestCard } from '../composants/CollectionRulesRestCard';
import { CustodyFeesCard } from '../composants/CustodyFeesCard';
import { HoldingCapCard } from '../composants/HoldingCapCard';
import { IdentityCard } from '../composants/IdentityCard';
import { PlansCard } from '../composants/PlansCard';
import { SettlementDeadlineCard } from '../composants/SettlementDeadlineCard';
import { ValidationChainCard } from '../composants/ValidationChainCard';
import { CustodyFeesModal } from '../modal/CustodyFeesModal';
import { EditIdentityModal } from '../modal/EditIdentityModal';
import { ManagePlansModal } from '../modal/ManagePlansModal';
import { SETTINGS_SECTIONS, useSettingsPage } from './useSettingsPage';

const NAV_ICONS: Record<string, React.ReactNode> = {
  identity: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 15a5.5 5.5 0 0 1 11 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  plans: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3" y="4" width="12" height="10" rx="1.6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 7h12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  rules: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M4 9l3 3 7-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  custody: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 3l6 3v4c0 3.5-2.5 5-6 6-3.5-1-6-2.5-6-6V6l6-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  ),
  validation: (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="13" cy="13" r="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 7v3a3 3 0 0 0 3 3h3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
};

/** Configuration — lecture fidèle à la maquette 9a, éditions inline/modale par section. */
export const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { settings, isPending, activeSection, goToSection, openEditIdentity, openManagePlans, openCustodyFees } = useSettingsPage();

  const secondaryNav: AdminSecondaryNavItem[] = SETTINGS_SECTIONS.map((section) => ({
    id: section.id,
    label: section.label,
    icon: NAV_ICONS[section.id],
    active: activeSection === section.id,
    onClick: () => goToSection(section.id),
  }));

  if (!settings) {
    return (
      <AdminShell breadcrumb={[{ label: 'Administration', to: '/admin' }, { label: 'Configuration' }]} title="Configuration">
        {isPending ? <Skeleton variant="card" /> : <div className="text-sm font-medium text-ink-muted">Paramètres indisponibles.</div>}
      </AdminShell>
    );
  }

  return (
    <AdminShell
      breadcrumb={[{ label: 'Administration', to: '/admin' }, { label: 'Configuration' }]}
      title="Configuration"
      subtitle="Paramètres MEC La Confiance"
      secondaryNav={secondaryNav}
      actions={
        <Button variant="secondary" size="sm" onClick={() => navigate('/admin/changelog')}>
          Journal des changements
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <IdentityCard identity={settings.identity} onEdit={openEditIdentity} />
        <PlansCard plans={settings.contributionPlans} onManage={openManagePlans} />

        <div id="settings-section-rules" className="flex flex-col gap-3">
          <div className="text-[15px] font-extrabold text-ink">Règles de collecte</div>
          <HoldingCapCard rules={settings.collectionRules} />
          <SettlementDeadlineCard rules={settings.collectionRules} />
          <CollectionRulesRestCard rules={settings.collectionRules} />
        </div>

        <CustodyFeesCard custodyFees={settings.custodyFees} onEdit={openCustodyFees} />
        <ValidationChainCard chains={settings.validationChains} />
      </div>

      <EditIdentityModal />
      <ManagePlansModal />
      <CustodyFeesModal />
    </AdminShell>
  );
};
