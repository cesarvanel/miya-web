import { Money } from "@miya/kernel";
import { SettlementLineStatus } from "../entities/SettlementSlip";

export interface SettlementLineStatusTotal {
  count: number;
  amount: Money;
}


export type SlipSubtotals = Record<SettlementLineStatus, SettlementLineStatusTotal>;
