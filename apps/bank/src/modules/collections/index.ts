import { CollectionsSelectors } from './domain/selectors/Selectors';
import { collectionsSlice } from './domain/slices/CollectionsSlice';

// Types de domaine
export { RoundStatus, RoundsAdapter } from './domain/entities/CollectionRound';
export type { CollectionRound, PartialDeposit, RoundAgent, RoundProgress } from './domain/entities/CollectionRound';
export { RoundStopStatus, StopsAdapter } from './domain/entities/RoundStop';
export type { RoundStop, RoundStopClient } from './domain/entities/RoundStop';
export type { RoundKpis, StopsBreakdown } from './domain/selectors/Selectors';

// Reducer (branché dans RootReducer)
export const collectionsReducer = collectionsSlice.reducer;

// Events — canoniques, consommés aussi par le module dashboard (et settlements pour partialDepositValidated)
export { collectionConfirmed, partialDepositValidated, roundClosed } from './domain/events/Events';
export type {
  CollectionConfirmedPayload,
  PartialDepositValidatedPayload,
  RoundClosedPayload,
} from './domain/events/Events';

// Selectors — groupés, comme prescrit par CLAUDE.md
export const collectionsSelectors = {
  ...CollectionsSelectors,
};

// Use cases
export { FetchRoundsAsync } from './application/usecases/fetch-rounds-async/FetchRoundsAsync';
export type { FetchRoundsCommand } from './application/usecases/fetch-rounds-async/FetchRoundsCommand';
export type { FetchRoundsResponse } from './application/usecases/fetch-rounds-async/FetchRoundsResponse';

export { FetchRoundDetailAsync } from './application/usecases/fetch-round-detail-async/FetchRoundDetailAsync';
export type { FetchRoundDetailCommand } from './application/usecases/fetch-round-detail-async/FetchRoundDetailCommand';
export type { FetchRoundDetailResponse } from './application/usecases/fetch-round-detail-async/FetchRoundDetailResponse';

// Ports (types utilisés par la composition root)
export type { CollectionsDependencies } from './application/ports/CollectionsDependencies';
export type { CollectionGateway } from './application/ports/CollectionGateway';

// Infrastructure (instanciée par la composition root)
export { FakeCollectionGateway } from './infrastructure/gateways/FakeCollectionGateway';
export { startCollectionsActivitySimulation } from './infrastructure/realtime/CollectionsActivitySimulator';
export { CollectionsRouter } from './infrastructure/router/CollectionsRouter';
export { CollectionsRoutes } from './infrastructure/router/CollectionsRoutes';
