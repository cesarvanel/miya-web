import type { PlatformAlert, PlatformKpis, TopBank, VolumePoint } from '../../domain/entities/Overview';

export interface OverviewSnapshot {
  kpis: PlatformKpis;
  volumeSeries: VolumePoint[];
  topBanks: TopBank[];
  alerts: PlatformAlert[];
}

export interface OverviewGateway {
  fetchOverview: () => Promise<OverviewSnapshot>;
}
