import type { DisbursementMethod } from '../../../domain/entities/Withdrawal';

export interface DisburseWithdrawalCommand {
  withdrawalId: string;
  method: DisbursementMethod;
  /** Requis quand method === ViaAgent. */
  agentId?: string;
}
