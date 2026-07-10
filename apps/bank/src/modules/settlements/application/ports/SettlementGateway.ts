import type { SettlementSlip } from '../../domain/entities/SettlementSlip';
import { FetchSettlementQueueResponse } from '../usecases/fetch-settlement-queue-async/FetchSettlementQueueResponse';

export interface ValidateSettlementResult {
  receiptNumber: string;
}

export interface RejectSettlementInput {
  reason: string;
  receivedAmount: number;
}

export interface SettlementGateway {
  fetchQueue: () => Promise<FetchSettlementQueueResponse>;
  fetchSlip: (id: string) => Promise<SettlementSlip>;
  validate: (id: string) => Promise<ValidateSettlementResult>;
  reject: (id: string, input: RejectSettlementInput) => Promise<void>;
}
