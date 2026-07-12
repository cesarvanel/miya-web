import type { ClientOperation } from '../../../domain/entities/ClientOperation';

export interface FetchClientOperationsResponse {
  operations: ClientOperation[];
}
