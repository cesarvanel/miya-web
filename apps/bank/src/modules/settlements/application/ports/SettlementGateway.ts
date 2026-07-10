import type { FetchSettlementQueueResponse } from '../usecases/fetch-settlement-queue-async/FetchSettlementQueueResponse';
import type { FetchSlipResponse } from '../usecases/fetch-slip-async/FetchSlipResponse';
import type { ValidateSettlementResponse } from '../usecases/validate-settlement-async/ValidateSettlementResponse';

export interface RejectSettlementInput {
  reason: string;
  receivedAmount: number;
}

export interface SettlementGateway {
  fetchQueue: () => Promise<FetchSettlementQueueResponse>;
  fetchSlip: (id: string) => Promise<FetchSlipResponse>;
  validate: (id: string) => Promise<ValidateSettlementResponse>;
  reject: (id: string, input: RejectSettlementInput) => Promise<void>;
}
