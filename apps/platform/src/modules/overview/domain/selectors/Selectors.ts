import { createSelector } from '@reduxjs/toolkit';
import type { PlatformRootState } from '@/config/store';
import { AlertSeverity, type PlatformAlert } from '../entities/Overview';

const SEVERITY_ORDER: Record<AlertSeverity, number> = {
  [AlertSeverity.Critical]: 0,
  [AlertSeverity.Warning]: 1,
  [AlertSeverity.Info]: 2,
};

export const selectKpis = (state: PlatformRootState) => state.overview.kpis;

export const selectVolumeSeries = (state: PlatformRootState) => state.overview.volumeSeries;

export const selectTopBanks = (state: PlatformRootState) => state.overview.topBanks;

const selectRawAlerts = (state: PlatformRootState) => state.overview.alerts;

export const selectAlerts = createSelector([selectRawAlerts], (alerts): PlatformAlert[] =>
  [...alerts].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]),
);

export const selectCriticalAlertsCount = createSelector(
  [selectRawAlerts],
  (alerts) => alerts.filter((alert) => alert.severity === AlertSeverity.Critical).length,
);

export const OverviewSelectors = {
  selectKpis,
  selectVolumeSeries,
  selectTopBanks,
  selectAlerts,
  selectCriticalAlertsCount,
};
