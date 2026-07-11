import {
  selectActivityFeed,
  selectAlerts,
  selectAllAgents,
  selectKpis,
  selectSortedAgents,
} from './domain/selectors/Selectors';
import { dashboardSlice } from './domain/slices/DashboardSlice';

// Types de domaine
export { AgentDayStatus, AgentDaySummariesAdapter } from './domain/entities/AgentDaySummary';
export type { AgentDaySummary, RoundProgress } from './domain/entities/AgentDaySummary';
export { ActivityEventKind } from './domain/entities/ActivityEvent';
export type { ActivityEvent } from './domain/entities/ActivityEvent';
export type { DashboardAlert, DashboardAlertKind, DashboardKpis } from './domain/types/Type';

// Reducer (branché dans RootReducer)
export const dashboardReducer = dashboardSlice.reducer;

// Events (réalimentés par le RealtimeClient — jamais de mutation directe)
// disputeOpened n'est pas ré-exporté ici : le module disputes en est le propriétaire canonique.
export { collectionConfirmed } from './domain/events/Events';
export type { CollectionConfirmedPayload } from './domain/events/Events';

// Selectors — groupés, comme prescrit par CLAUDE.md
export const dashboardSelectors = {
  agents: selectSortedAgents,
  allAgents: selectAllAgents,
  kpis: selectKpis,
  alerts: selectAlerts,
  activityFeed: selectActivityFeed,
};

// Use cases
export { FetchDaySummaryAsync } from './application/usecases/fetch-day-summary-async/FetchDaySummaryAsync';
export type { FetchDaySummaryCommand } from './application/usecases/fetch-day-summary-async/FetchDaySummaryCommand';
export type { FetchDaySummaryResponse } from './application/usecases/fetch-day-summary-async/FetchDaySummaryResponse';

// Ports (types utilisés par la composition root)
export type { DashboardDependencies } from './application/ports/DashboardDependencies';
export type { DashboardGateway } from './application/ports/DashboardGateway';

// Infrastructure (instanciée par la composition root)
export { FakeDashboardGateway } from './infrastructure/gateways/FakeDashboardGateway';
export { startDashboardActivitySimulation } from './infrastructure/realtime/DashboardActivitySimulator';
export { DashboardRouter } from './infrastructure/router/DashboardRouter';
