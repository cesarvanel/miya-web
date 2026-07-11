import { DisputesSelectors } from './domain/selectors/Selectors';
import { disputesSlice } from './domain/slices/DisputesSlice';

// Types de domaine
export { DisputeDecision, DisputeStatus, DisputesAdapter } from './domain/entities/Dispute';
export type {
  AgentHistory,
  ClientHistory,
  ClientRegularity,
  Dispute,
  DisputeAgent,
  DisputeClient,
  DisputeResolution,
} from './domain/entities/Dispute';

// Reducer (branché dans RootReducer)
export const disputesReducer = disputesSlice.reducer;

// Events — canoniques, consommés aussi par le module dashboard
export { disputeOpened, disputeResolved } from './domain/events/Events';
export type { DisputeOpenedPayload, DisputeResolvedPayload } from './domain/events/Events';

// Selectors — groupés, comme prescrit par CLAUDE.md
export const disputesSelectors = {
  ...DisputesSelectors,
};

// Use cases
export { FetchDisputesAsync } from './application/usecases/fetch-disputes-async/FetchDisputesAsync';
export type { FetchDisputesCommand } from './application/usecases/fetch-disputes-async/FetchDisputesCommand';
export type { FetchDisputesResponse } from './application/usecases/fetch-disputes-async/FetchDisputesResponse';

export { ResolveDisputeAsync } from './application/usecases/resolve-dispute-async/ResolveDisputeAsync';
export type { ResolveDisputeCommand } from './application/usecases/resolve-dispute-async/ResolveDisputeCommand';
export type { ResolveDisputeResponse } from './application/usecases/resolve-dispute-async/ResolveDisputeResponse';

// Ports (types utilisés par la composition root)
export type { DisputesDependencies } from './application/ports/DisputesDependencies';
export type { DisputeGateway, ResolveDisputeInput } from './application/ports/DisputeGateway';

// Infrastructure (instanciée par la composition root)
export { FakeDisputeGateway } from './infrastructure/gateways/FakeDisputeGateway';
export { startDisputesActivitySimulation } from './infrastructure/realtime/DisputesActivitySimulator';
export { DisputesRouter } from './infrastructure/router/DisputesRouter';
export { DisputesRoutes } from './infrastructure/router/DisputesRoutes';
