
import { SettlementSelectors } from './domain/selectors/Selectors';
import { settlementsSlice } from './domain/slices/SettlementsSlice';

// Types de domaine
export type {
  PartialDeposit,
  SettlementLine,
  SettlementLineStatus,
  SettlementRejection,
  SettlementSlip,
  SettlementStatus,
} from './domain/entities/SettlementSlip';

export const settlementsReducer = settlementsSlice.reducer;


export const settlementSelectors = {
  ...SettlementSelectors
};

export { FetchSettlementQueueAsync } from './application/usecases/fetch-settlement-queue-async/FetchSettlementQueueAsync';
export { FetchSlipAsync } from './application/usecases/FetchSlipAsync';
export type { FetchSlipArg } from './application/usecases/FetchSlipAsync';
export { ValidateSettlementAsync } from './application/usecases/ValidateSettlementAsync';
export type {
  ValidateSettlementArg,
  ValidateSettlementResult,
} from './application/usecases/ValidateSettlementAsync';
export { RejectSettlementAsync } from './application/usecases/RejectSettlementAsync';
export type { RejectSettlementArg } from './application/usecases/RejectSettlementAsync';

export type { SettlementsDependencies } from './application/ports/SettlementsDependencies';
export type {
  RejectSettlementInput,
  SettlementGateway,
  ValidateSettlementResult as SettlementGatewayValidateResult,
} from './application/ports/SettlementGateway';


export { FakeSettlementGateway } from './infrastructure/gateways/FakeSettlementGateway';
export { SettlementsRouter } from './infrastructure/router/SettlementsRouter';
export { SettlementsRoutes } from './infrastructure/router/SettlementsRoutes';
