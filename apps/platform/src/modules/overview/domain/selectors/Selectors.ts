import { createSelector } from '@reduxjs/toolkit';
import { BillingStatus, tenantsSelectors } from '@/modules/tenants';
import type { PlatformRootState } from '@/config/store';
import { AlertKind, AlertSeverity, type PlatformAlert } from '../entities/Overview';

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.Warning]: 1,
  [AlertSeverity.Info]: 2,
};

export const selectKpis = (state: PlatformRootState) => state.overview.kpis;

export const selectVolumeSeries = (state: PlatformRootState) => state.overview.volumeSeries;

export const selectTopBanks = (state: PlatformRootState) => state.overview.topBanks;

const selectRawAlerts = (state: PlatformRootState) => state.overview.alerts;

/**
 * Les alertes plateforme sont un instantané pris au fetch — mais une alerte
 * "Retard de paiement" doit s'éteindre dès le paiement enregistré côté
 * billing, sans attendre un nouveau fetch. On la reconcilie donc ici avec le
 * `billingStatus` live du tenant plutôt que de la stocker figée.
 */
export const selectAlerts = createSelector(
  [selectRawAlerts, tenantsSelectors.selectAllTenants],
  (alerts, tenants): PlatformAlert[] =>
    [...alerts]
      .filter(
        (alert) =>
          alert.kind !== AlertKind.PaymentOverdue ||
          tenants.find((tenant) => tenant.id === alert.bankId)?.billingStatus === BillingStatus.Overdue,
      )
      .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
);

export const selectCriticalAlertsCount = createSelector(
  [selectAlerts],
  (alerts) => alerts.filter((alert) => alert.severity === AlertSeverity.Critical).length,
);

export const OverviewSelectors = {
  selectKpis,
  selectVolumeSeries,
  selectTopBanks,
  selectAlerts,
  selectCriticalAlertsCount,
};
