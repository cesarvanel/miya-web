import type { BankRootState } from '@/config/stores/store';
import {
  SettlementsAdapter,
  SettlementStatus,
  SettlementKind,
  type SettlementSlip,
} from '../entities/SettlementSlip';
import { selectPendingCount, selectPendingSlipByAgentId } from './Selectors';

const makeSlip = (overrides: Partial<SettlementSlip> = {}): SettlementSlip => ({
  id: 'BRD-1',
  kind: SettlementKind.Settlement,
  slipNumber: 'BRD-1',
  agentId: 'agent-1',
  agentName: 'Agent Un',
  zone: 'Zone',
  clientCount: 10,
  closedAt: null,
  expectedAmount: 10_000,
  status: SettlementStatus.PendingValidation,
  lines: [],
  partialDeposits: [],
  partialDepositContext: null,
  rejection: null,
  ...overrides,
});

const makeState = (slips: SettlementSlip[]): BankRootState =>
  ({
    settlements: SettlementsAdapter.setAll(SettlementsAdapter.getInitialState(), slips),
  }) as unknown as BankRootState;

describe('settlements selectors', () => {
  describe('selectPendingCount', () => {
    it('counts only slips pending validation', () => {
      const state = makeState([
        makeSlip({ id: 'a', status: SettlementStatus.PendingValidation }),
        makeSlip({ id: 'b', status: SettlementStatus.PendingValidation }),
        makeSlip({ id: 'c', status: SettlementStatus.Validated }),
        makeSlip({ id: 'd', status: SettlementStatus.Rejected }),
      ]);

      expect(selectPendingCount(state)).toBe(2);
    });

    it('returns zero when there is nothing pending', () => {
      const state = makeState([makeSlip({ status: SettlementStatus.Validated })]);
      expect(selectPendingCount(state)).toBe(0);
    });
  });

  describe('selectPendingSlipByAgentId', () => {
    it('finds the pending slip for the given agent — used by disputes (impact reversement)', () => {
      const state = makeState([
        makeSlip({ id: 'BRD-2026-0703-02', agentId: 'agent-grace-atangana', slipNumber: 'BRD-2026-0703-02' }),
        makeSlip({ id: 'BRD-other', agentId: 'agent-other' }),
      ]);

      const slip = selectPendingSlipByAgentId(state, 'agent-grace-atangana');

      expect(slip?.slipNumber).toBe('BRD-2026-0703-02');
    });

    it('returns undefined when the agent has no pending slip', () => {
      const state = makeState([makeSlip({ agentId: 'agent-1', status: SettlementStatus.Validated })]);
      expect(selectPendingSlipByAgentId(state, 'agent-1')).toBeUndefined();
    });
  });
});
