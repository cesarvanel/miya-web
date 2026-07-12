import type { CreateClientCommand } from '../usecases/create-client-async/CreateClientCommand';
import type { CreateClientResponse } from '../usecases/create-client-async/CreateClientResponse';
import type { FetchClientOperationsResponse } from '../usecases/fetch-client-operations-async/FetchClientOperationsResponse';
import type { FetchClientResponse } from '../usecases/fetch-client-async/FetchClientResponse';
import type { FetchClientsResponse } from '../usecases/fetch-clients-async/FetchClientsResponse';

export interface ClientGateway {
  fetchAll: () => Promise<FetchClientsResponse>;
  fetchOne: (id: string) => Promise<FetchClientResponse>;
  fetchOperations: (clientId: string) => Promise<FetchClientOperationsResponse>;
  create: (command: CreateClientCommand) => Promise<CreateClientResponse>;
  updateUsualAmount: (id: string, amount: number) => Promise<void>;
  deactivate: (id: string, reason: string) => Promise<void>;
}
