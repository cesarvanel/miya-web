import type { CapBehavior } from '../../../domain/entities/BankSettings';

export interface UpdateHoldingCapCommand {
  holdingCap: number;
  capBehavior: CapBehavior;
}
