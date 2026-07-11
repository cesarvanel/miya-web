import type { Dispute } from '../../../domain/entities/Dispute';

export interface FetchDisputesResponse {
  disputes: Dispute[];
}
