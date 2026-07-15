import { SupervisionSelectors } from './domain/selectors/Selectors';
import { supervisionSlice } from './domain/slices/SupervisionSlice';

// Types de domaine
export { AttentionSeverity } from './domain/entities/Supervision';
export type {
  AgencyBreakdownEntry,
  AgencyReconciliation,
  AgentRanking,
  AttentionPoint,
  DailyCollectionPoint,
  SupervisionDaySnapshot,
  SupervisionMonthSnapshot,
} from './domain/entities/Supervision';

// Reducer (branché dans RootReducer)
export const supervisionReducer = supervisionSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const supervisionSelectors = {
  ...SupervisionSelectors,
};

// Use cases
export { FetchSupervisionAsync } from './application/usecases/fetch-supervision-async/FetchSupervisionAsync';
export type { FetchSupervisionCommand } from './application/usecases/fetch-supervision-async/FetchSupervisionCommand';
export type { FetchSupervisionResponse } from './application/usecases/fetch-supervision-async/FetchSupervisionResponse';

// Ports (types utilisés par la composition root)
export type { SupervisionDependencies } from './application/ports/SupervisionDependencies';
export type { SupervisionGateway } from './application/ports/SupervisionGateway';

// Infrastructure (instanciée par la composition root)
export { FakeSupervisionGateway } from './infrastructure/gateways/FakeSupervisionGateway';
export { SupervisionRouter } from './infrastructure/router/SupervisionRouter';
export { SupervisionRoutes } from './infrastructure/router/SupervisionRoutes';
