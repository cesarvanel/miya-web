import { createSelector } from '@reduxjs/toolkit';
import type { PlatformRootState } from '@/config/store';
import { invoicesAdapter, InvoiceStatus, type Invoice } from '../entities/Invoice';
import { plansAdapter, PlanStatus, type Plan } from '../entities/Plan';

const plansSelectors = plansAdapter.getSelectors((state: PlatformRootState) => state.billing.plans);
const invoicesSelectors = invoicesAdapter.getSelectors((state: PlatformRootState) => state.billing.invoices);

export const selectAllPlans = plansSelectors.selectAll;

export const selectPlanById = (state: PlatformRootState, planId: string): Plan | undefined =>
  plansSelectors.selectById(state, planId);

export const selectAllInvoices = invoicesSelectors.selectAll;

export const selectInvoiceById = (state: PlatformRootState, invoiceId: string): Invoice | undefined =>
  invoicesSelectors.selectById(state, invoiceId);

/**
 * Somme mensuelle des plans Actifs pondérée par leur nombre de banques
 * abonnées — fonction pure (pas un selector Redux) pour être réutilisable
 * telle quelle par `FakeOverviewGateway`, qui dérive le KPI MRR de la vue
 * d'ensemble de ce même calcul plutôt que d'un chiffre codé en dur.
 */
export const computeMrr = (plans: Plan[]): number =>
  plans
    .filter((plan) => plan.status === PlanStatus.Active)
    .reduce((sum, plan) => sum + plan.monthlyPrice * plan.tenantsCount, 0);

export const selectMrr = createSelector([selectAllPlans], computeMrr);

export const selectInvoiceTotals = createSelector([selectAllInvoices], (invoices) => ({
  paid: invoices.filter((invoice) => invoice.status === InvoiceStatus.Paid).reduce((sum, invoice) => sum + invoice.amount, 0),
  pending: invoices.filter((invoice) => invoice.status === InvoiceStatus.Pending).reduce((sum, invoice) => sum + invoice.amount, 0),
  overdue: invoices.filter((invoice) => invoice.status === InvoiceStatus.Overdue).reduce((sum, invoice) => sum + invoice.amount, 0),
}));

export type InvoiceStatusFilter = 'all' | 'paid' | 'pending' | 'overdue';

export const selectInvoicesFilterCounts = createSelector([selectAllInvoices], (invoices) => ({
  all: invoices.length,
  paid: invoices.filter((invoice) => invoice.status === InvoiceStatus.Paid).length,
  pending: invoices.filter((invoice) => invoice.status === InvoiceStatus.Pending).length,
  overdue: invoices.filter((invoice) => invoice.status === InvoiceStatus.Overdue).length,
}));

/** Badge sidebar "Abonnements" — nombre de factures en retard, à l'instant présent (state live, pas un instantané). */
export const selectOverdueCount = createSelector(
  [selectAllInvoices],
  (invoices) => invoices.filter((invoice) => invoice.status === InvoiceStatus.Overdue).length,
);

export interface InvoicesFilter {
  status: InvoiceStatusFilter;
  tenantId?: string;
}

export const selectFilteredInvoices = createSelector(
  [selectAllInvoices, (_state: PlatformRootState, filter: InvoicesFilter) => filter],
  (invoices, filter) => {
    let result = invoices;
    if (filter.status === 'paid') {
      result = result.filter((invoice) => invoice.status === InvoiceStatus.Paid);
    } else if (filter.status === 'pending') {
      result = result.filter((invoice) => invoice.status === InvoiceStatus.Pending);
    } else if (filter.status === 'overdue') {
      result = result.filter((invoice) => invoice.status === InvoiceStatus.Overdue);
    }
    if (filter.tenantId) {
      result = result.filter((invoice) => invoice.tenantId === filter.tenantId);
    }
    return result;
  },
);

/** Consommé par la mini-table facturation de la fiche tenant (remplace son ancien placeholder). */
export const selectInvoicesByTenant = createSelector(
  [selectAllInvoices, (_state: PlatformRootState, tenantId: string) => tenantId],
  (invoices, tenantId) => invoices.filter((invoice) => invoice.tenantId === tenantId),
);

export const selectOverdueInvoices = createSelector([selectAllInvoices], (invoices) =>
  invoices.filter((invoice) => invoice.status === InvoiceStatus.Overdue),
);

export const BillingSelectors = {
  selectAllPlans,
  selectPlanById,
  selectAllInvoices,
  selectInvoiceById,
  selectMrr,
  selectInvoiceTotals,
  selectInvoicesFilterCounts,
  selectOverdueCount,
  selectFilteredInvoices,
  selectInvoicesByTenant,
  selectOverdueInvoices,
};
