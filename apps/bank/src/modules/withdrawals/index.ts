import { WithdrawalsSelectors } from './domain/selectors/Selectors';
import { withdrawalsSlice } from './domain/slices/WithdrawalsSlice';

// Types de domaine
export { DisbursementMethod, WithdrawalStatus, WithdrawalsAdapter } from './domain/entities/Withdrawal';
export type {
  Withdrawal,
  WithdrawalApproval,
  WithdrawalClient,
  WithdrawalDisbursement,
  WithdrawalRejection,
} from './domain/entities/Withdrawal';

// Reducer (branché dans RootReducer)
export const withdrawalsReducer = withdrawalsSlice.reducer;

// Events — canoniques, consommés aussi par le module clients
export { withdrawalApproved, withdrawalDisbursed } from './domain/events/Events';
export type { WithdrawalApprovedPayload, WithdrawalDisbursedPayload } from './domain/events/Events';

// Selectors — groupés, comme prescrit par CLAUDE.md
export const withdrawalSelectors = {
  ...WithdrawalsSelectors,
};

// Use cases
export { FetchWithdrawalsAsync } from './application/usecases/fetch-withdrawals-async/FetchWithdrawalsAsync';
export type { FetchWithdrawalsCommand } from './application/usecases/fetch-withdrawals-async/FetchWithdrawalsCommand';
export type { FetchWithdrawalsResponse } from './application/usecases/fetch-withdrawals-async/FetchWithdrawalsResponse';

export { ApproveWithdrawalAsync } from './application/usecases/approve-withdrawal-async/ApproveWithdrawalAsync';
export type { ApproveWithdrawalCommand } from './application/usecases/approve-withdrawal-async/ApproveWithdrawalCommand';

export { RejectWithdrawalAsync } from './application/usecases/reject-withdrawal-async/RejectWithdrawalAsync';
export type { RejectWithdrawalCommand } from './application/usecases/reject-withdrawal-async/RejectWithdrawalCommand';

export { DisburseWithdrawalAsync } from './application/usecases/disburse-withdrawal-async/DisburseWithdrawalAsync';
export type { DisburseWithdrawalCommand } from './application/usecases/disburse-withdrawal-async/DisburseWithdrawalCommand';

// Ports (types utilisés par la composition root)
export type { WithdrawalsDependencies } from './application/ports/WithdrawalsDependencies';
export type { DisburseWithdrawalInput, WithdrawalGateway } from './application/ports/WithdrawalGateway';

// Infrastructure (instanciée par la composition root)
export { FakeWithdrawalGateway } from './infrastructure/gateways/FakeWithdrawalGateway';
export { WithdrawalsRouter } from './infrastructure/router/WithdrawalsRouter';
export { WithdrawalsRoutes } from './infrastructure/router/WithdrawalsRoutes';
