import React from 'react';
import { TenantStatus, type Tenant, type TenantPlanName } from '../../../domain/entities/Tenant';

interface TenantPlanBadgeProps {
  tenant: Tenant;
}

const PLAN_CLASSES: Record<TenantPlanName, string> = {
  Élite: 'bg-violet-soft text-violet',
  Croissance: 'bg-primary-soft text-primary',
  Essentiel: 'bg-cream-100 text-ink-faint',
};

/** Colonne Plan — un tenant en essai affiche « Essai » quel que soit le palier souscrit, comme la maquette. */
export const TenantPlanBadge: React.FC<TenantPlanBadgeProps> = ({ tenant }) => {
  if (tenant.status === TenantStatus.Trial) {
    return (
      <span className="w-fit rounded-full bg-amber-soft px-2.75 py-1.25 text-[11.5px] font-bold text-amber">
        Essai
      </span>
    );
  }
  return (
    <span className={['w-fit rounded-full px-2.75 py-1.25 text-[11.5px] font-bold', PLAN_CLASSES[tenant.plan.name]].join(' ')}>
      {tenant.plan.name}
    </span>
  );
};
