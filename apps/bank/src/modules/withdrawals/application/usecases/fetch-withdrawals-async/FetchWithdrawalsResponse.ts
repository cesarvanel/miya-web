import type { Withdrawal } from '../../../domain/entities/Withdrawal';

export interface FetchWithdrawalsResponse {
  withdrawals: Withdrawal[];
}
