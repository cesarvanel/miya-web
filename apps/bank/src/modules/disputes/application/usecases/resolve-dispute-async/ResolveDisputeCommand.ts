import type { DisputeDecision } from '../../../domain/entities/Dispute';

export interface ResolveDisputeCommand {
  disputeId: string;
  inFavorOf: DisputeDecision;
  reason: string;
}
