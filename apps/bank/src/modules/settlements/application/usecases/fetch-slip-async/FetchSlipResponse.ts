import type { SettlementSlip } from '../../../domain/entities/SettlementSlip';

export interface FetchSlipResponse {
  settlement: SettlementSlip;
}
