import type { DisputeDecision } from '../../domain/entities/Dispute';
import type { FetchDisputesResponse } from '../usecases/fetch-disputes-async/FetchDisputesResponse';

export interface ResolveDisputeInput {
  disputeId: string;
  inFavorOf: DisputeDecision;
  reason: string;
  decidedBy: string;
}

export interface DisputeGateway {
  fetchAll: () => Promise<FetchDisputesResponse>;
  resolve: (input: ResolveDisputeInput) => Promise<void>;
}
