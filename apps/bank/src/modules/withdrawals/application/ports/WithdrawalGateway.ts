import type { DisbursementMethod } from '../../domain/entities/Withdrawal';
import type { FetchWithdrawalsResponse } from '../usecases/fetch-withdrawals-async/FetchWithdrawalsResponse';

export interface DisburseWithdrawalInput {
  withdrawalId: string;
  method: DisbursementMethod;
  agentId?: string;
}

export interface WithdrawalGateway {
  fetchAll: () => Promise<FetchWithdrawalsResponse>;
  approve: (id: string) => Promise<void>;
  reject: (id: string, reason: string) => Promise<void>;
  disburse: (command: DisburseWithdrawalInput) => Promise<void>;
}
