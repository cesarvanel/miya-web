import { createSelector } from '@reduxjs/toolkit';
import { Money } from '@miya/kernel';
import type { BankRootState } from '@/config/stores/store';
import {
  SettlementsAdapter,
  SettlementStatus,
  type SettlementSlip,
} from '../entities/SettlementSlip';
import { SettlementLineStatusTotal, SlipSubtotals } from '../types/Type';

const adapterSelectors = SettlementsAdapter.getSelectors(
  (state: BankRootState) => state.settlements,
);

export const selectAllSlips = adapterSelectors.selectAll;

export const selectSlipById = (
  state: BankRootState,
  id: string,
): SettlementSlip | undefined => adapterSelectors.selectById(state, id);

export const selectQueue = createSelector([selectAllSlips], (slips) =>
  slips.filter((slip) => slip.status === SettlementStatus.PendingValidation),
);

export const selectQueueTotal = createSelector([selectQueue], (queue) =>
  queue.reduce(
    (total, slip) => total.add(Money.from(slip.expectedAmount)),
    Money.from(0),
  ),
);

/** Compteur pour la pastille de nav « Reversements » — bordereaux en attente de validation. */
export const selectPendingCount = createSelector([selectQueue], (queue) => queue.length);


const emptyTotal = (): SettlementLineStatusTotal => ({
  count: 0,
  amount: Money.from(0),
});

const selectSlipSubtotals = createSelector(
  [selectSlipById],
  (slip): SlipSubtotals => {
    const totals: SlipSubtotals = {
      collected: emptyTotal(),
      extra: emptyTotal(),
      absent: emptyTotal(),
      disputed: emptyTotal(),
    };
    for (const line of slip?.lines ?? []) {
      const bucket = totals[line.status];
      totals[line.status] = {
        count: bucket.count + 1,
        amount: bucket.amount.add(Money.from(line.amount)),
      };
    }
    return totals;
  },
);


export const SettlementSelectors = {
  selectAllSlips,
  selectSlipById,
  selectQueue,
  selectQueueTotal,
  selectPendingCount,
  selectSlipSubtotals,
};