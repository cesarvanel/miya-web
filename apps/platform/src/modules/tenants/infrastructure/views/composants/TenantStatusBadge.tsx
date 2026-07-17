import React from 'react';
import { BillingStatus, TenantStatus, type Tenant } from '../../../domain/entities/Tenant';

interface TenantStatusBadgeProps {
  tenant: Tenant;
}

/** Statut + sous-ligne facturation quand une banque Active est en retard de paiement — maquette 2a ligne 6. */
export const TenantStatusBadge: React.FC<TenantStatusBadgeProps> = ({ tenant }) => {
  if (tenant.status === TenantStatus.Suspended) {
    return (
      <span className="w-fit rounded-full bg-cream-100 px-2.75 py-1.25 text-[11.5px] font-bold text-ink-muted">
        ◼ Suspendue
      </span>
    );
  }

  if (tenant.status === TenantStatus.Trial) {
    const daysLeft = tenant.trialEndsAt
      ? Math.max(0, Math.ceil((new Date(tenant.trialEndsAt).getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
      : null;
    return (
      <span className="w-fit rounded-full bg-amber-soft px-2.75 py-1.25 text-[11.5px] font-bold text-amber">
        ● Essai{daysLeft !== null ? ` · ${daysLeft}j` : ''}
      </span>
    );
  }

  if (tenant.billingStatus === BillingStatus.Overdue) {
    return (
      <div className="flex flex-col gap-0.75">
        <span className="w-fit rounded-full bg-danger-soft px-2.75 py-1.25 text-[11.5px] font-bold text-danger">
          En retard
        </span>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-admin-primary">
          <span className="bg-admin-primary size-1.5 rounded-full" />
          Active · paiement
        </span>
      </div>
    );
  }

  return (
    <span className="bg-primary-soft text-primary w-fit rounded-full px-2.75 py-1.25 text-[11.5px] font-bold">
      ● Active
    </span>
  );
};
