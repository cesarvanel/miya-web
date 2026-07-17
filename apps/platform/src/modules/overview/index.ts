import { OverviewSelectors } from './domain/selectors/Selectors';
import { overviewSlice } from './domain/slices/OverviewSlice';

// Types de domaine
export { AlertKind, AlertSeverity } from './domain/entities/Overview';
export type { BankColorTone, PlatformAlert, PlatformKpis, TopBank, VolumePoint } from './domain/entities/Overview';

// Reducer (branché dans root-reducer)
export const overviewReducer = overviewSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const overviewSelectors = {
  ...OverviewSelectors,
};

// Use cases
export { FetchOverviewAsync } from './application/usecases/fetch-overview-async/FetchOverviewAsync';

// Ports (types utilisés par la composition root)
export type { OverviewDependencies } from './application/ports/OverviewDependencies';
export type { OverviewGateway, OverviewSnapshot } from './application/ports/OverviewGateway';

// Infrastructure (instanciée par la composition root)
export { FakeOverviewGateway } from './infrastructure/gateways/FakeOverviewGateway';
export { OverviewPage } from './infrastructure/views/index/OverviewPage';
