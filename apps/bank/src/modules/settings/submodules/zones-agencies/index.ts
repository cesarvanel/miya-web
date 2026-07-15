import { AgenciesSelectors } from './domain/selectors/Selectors';
import { agenciesSlice } from './domain/slices/AgenciesSlice';

// Types de domaine
export type { Agency } from './domain/entities/Agency';
export type { CollectionZone } from './domain/entities/CollectionZone';

// Reducer (branché dans RootReducer)
export const agenciesReducer = agenciesSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const agenciesSelectors = {
  ...AgenciesSelectors,
};

// Use cases
export { FetchAgenciesAsync } from './application/usecases/fetch-agencies-async/FetchAgenciesAsync';
export type { FetchAgenciesCommand } from './application/usecases/fetch-agencies-async/FetchAgenciesCommand';
export type { FetchAgenciesResponse } from './application/usecases/fetch-agencies-async/FetchAgenciesResponse';

export { CreateZoneAsync } from './application/usecases/create-zone-async/CreateZoneAsync';
export type { CreateZoneCommand } from './application/usecases/create-zone-async/CreateZoneCommand';
export type { CreateZoneResponse } from './application/usecases/create-zone-async/CreateZoneResponse';

export { AssignZoneAgentAsync } from './application/usecases/assign-zone-agent-async/AssignZoneAgentAsync';
export type { AssignZoneAgentCommand } from './application/usecases/assign-zone-agent-async/AssignZoneAgentCommand';

// Ports (types utilisés par la composition root)
export type { AgenciesDependencies } from './application/ports/AgenciesDependencies';
export type { AgenciesGateway, CreateZoneInput } from './application/ports/AgenciesGateway';

// Infrastructure (instanciée par la composition root)
export { FakeAgenciesGateway } from './infrastructure/gateways/FakeAgenciesGateway';
export { AgenciesRouter } from './infrastructure/router/AgenciesRouter';
export { AgenciesRoutes } from './infrastructure/router/AgenciesRoutes';
