import { SettlementSelectors } from './domain/selectors/Selectors';
import { settlementsSlice } from './domain/slices/SettlementsSlice';

// Types de domaine
export {
  SettlementLineStatus,
  SettlementStatus,
} from './domain/entities/SettlementSlip';
export type {
  PartialDeposit,
  SettlementLine,
  SettlementRejection,
  SettlementSlip,
} from './domain/entities/SettlementSlip';

// Reducer (branché dans RootReducer)
export const settlementsReducer = settlementsSlice.reducer;

// Events
export { settlementValidated } from './domain/events/Events';

// Selectors — groupés, comme prescrit par CLAUDE.md
export const settlementSelectors = {
  ...SettlementSelectors,
};
export type { SettlementLineStatusTotal, SlipSubtotals } from './domain/types/Type';

// Use cases
export { FetchSettlementQueueAsync } from './application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';
export type { FetchSettlementQueueCommand } from './application/usecases/fetch-settlement-queue-async/FetchSettlementQueueCommand';
export type { FetchSettlementQueueResponse } from './application/usecases/fetch-settlement-queue-async/FetchSettlementQueueResponse';

export { FetchSlipAsync } from './application/usecases/fetch-slip-async/FetchSlipAsync';
export type { FetchSlipCommand } from './application/usecases/fetch-slip-async/FetchSlipCommand';
export type { FetchSlipResponse } from './application/usecases/fetch-slip-async/FetchSlipResponse';

export { ValidateSettlementAsync } from './application/usecases/validate-settlement-async/ValidateSettlementAsync';
export type { ValidateSettlementCommand } from './application/usecases/validate-settlement-async/ValidateSettlementCommand';
export type { ValidateSettlementResponse } from './application/usecases/validate-settlement-async/ValidateSettlementResponse';

export { RejectSettlementAsync } from './application/usecases/reject-settlement-async/RejectSettlementAsync';
export type { RejectSettlementCommand } from './application/usecases/reject-settlement-async/RejectSettlementCommand';

// Ports (types utilisés par la composition root)
export type { SettlementsDependencies } from './application/ports/SettlementsDependencies';
export type { RejectSettlementInput, SettlementGateway } from './application/ports/SettlementGateway';

// Infrastructure (instanciée par la composition root)
export { FakeSettlementGateway } from './infrastructure/gateways/FakeSettlementGateway';
export { SettlementsRouter } from './infrastructure/router/SettlementsRouter';
export { SettlementsRoutes } from './infrastructure/router/SettlementsRoutes';
