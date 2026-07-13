import { ClientsSelectors } from './domain/selectors/Selectors';
import { clientsSlice } from './domain/slices/ClientsSlice';

// Types de domaine
export { ClientStatus, ClientsAdapter } from './domain/entities/Client';
export type { Client, ClientAssignedAgent, ClientIdDocument, ClientRegularity, PendingWithdrawal } from './domain/entities/Client';
export {
  DayOfWeek,
  DAY_OF_WEEK_ORDER,
  DAY_OF_WEEK_SHORT_LABEL,
  EngagementPreset,
  SAVINGS_PLAN_FLOOR_AMOUNT,
} from './domain/entities/SavingsPlan';
export type { SavingsEngagement, SavingsPlan, SavingsPlanComputed } from './domain/entities/SavingsPlan';
export { ClientOperationKind, ClientOperationStatus, OperationsAdapter } from './domain/entities/ClientOperation';
export type { ClientOperation } from './domain/entities/ClientOperation';

// Services purs du domaine — utilisés par le formulaire ET par les selectors
export {
  computeEngagementEndDate,
  computePlannedCollectionDays,
  computeSavingsPlanComputed,
  computeSavingsTarget,
} from './domain/services/SavingsPlanCalculator';

// Reducer (branché dans RootReducer)
export const clientsReducer = clientsSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const clientsSelectors = {
  ...ClientsSelectors,
};
export type { ClientsListFilters, SavingsProgress } from './domain/selectors/Selectors';

// Use cases
export { FetchClientsAsync } from './application/usecases/fetch-clients-async/FetchClientsAsync';
export type { FetchClientsCommand } from './application/usecases/fetch-clients-async/FetchClientsCommand';
export type { FetchClientsResponse } from './application/usecases/fetch-clients-async/FetchClientsResponse';

export { FetchClientAsync } from './application/usecases/fetch-client-async/FetchClientAsync';
export type { FetchClientCommand } from './application/usecases/fetch-client-async/FetchClientCommand';
export type { FetchClientResponse } from './application/usecases/fetch-client-async/FetchClientResponse';

export { FetchClientOperationsAsync } from './application/usecases/fetch-client-operations-async/FetchClientOperationsAsync';
export type { FetchClientOperationsCommand } from './application/usecases/fetch-client-operations-async/FetchClientOperationsCommand';
export type { FetchClientOperationsResponse } from './application/usecases/fetch-client-operations-async/FetchClientOperationsResponse';

export { CreateClientAsync } from './application/usecases/create-client-async/CreateClientAsync';
export type {
  CreateClientAssignment,
  CreateClientCommand,
  CreateClientIdentity,
  CreateClientSavingsPlan,
} from './application/usecases/create-client-async/CreateClientCommand';
export type { CreateClientResponse } from './application/usecases/create-client-async/CreateClientResponse';

export { UpdateSavingsPlanAsync } from './application/usecases/update-savings-plan-async/UpdateSavingsPlanAsync';
export type { UpdateSavingsPlanCommand } from './application/usecases/update-savings-plan-async/UpdateSavingsPlanCommand';
export type { UpdateSavingsPlanResponse } from './application/usecases/update-savings-plan-async/UpdateSavingsPlanResponse';

export { DeactivateClientAsync } from './application/usecases/deactivate-client-async/DeactivateClientAsync';
export type { DeactivateClientCommand } from './application/usecases/deactivate-client-async/DeactivateClientCommand';
export type { DeactivateClientResponse } from './application/usecases/deactivate-client-async/DeactivateClientResponse';

// Ports (types utilisés par la composition root)
export type { ClientsDependencies } from './application/ports/ClientsDependencies';
export type { ClientGateway } from './application/ports/ClientGateway';

// Infrastructure (instanciée par la composition root)
export { FakeClientGateway } from './infrastructure/gateways/FakeClientGateway';
export { ClientsRouter } from './infrastructure/router/ClientsRouter';
export { ClientsRoutes } from './infrastructure/router/ClientsRoutes';
