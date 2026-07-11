import type { BankRootState } from '@/config/stores/store';
import { DisputesAdapter, DisputeStatus, type Dispute } from '../entities/Dispute';
import { selectDisputeGap, selectOpenCount, selectOpenDisputesForAgent } from './Selectors';

const makeDispute = (overrides: Partial<Dispute> = {}): Dispute => ({
  id: 'CT-1',
  openedAt: new Date().toISOString(),
  zone: 'Zone',
  status: DisputeStatus.Open,
  agent: { id: 'agent-grace-atangana', name: 'Grace Atangana', enteredAmount: 500 },
  client: { id: 'client-1', name: 'Client Un', declaredAmount: 1_000 },
  clientHistory: { regularity: { onTime: 29, total: 30 }, disputesLast12Months: 0, clientSince: '2022' },
  agentHistory: { confirmationRate: 98.4, disputesLast12Months: 3, settlementGaps: 1 },
  resolution: null,
  ...overrides,
});

const makeState = (disputes: Dispute[]): BankRootState =>
  ({
    disputes: DisputesAdapter.setAll(DisputesAdapter.getInitialState(), disputes),
  }) as unknown as BankRootState;

describe('disputes selectors', () => {
  describe('selectOpenCount', () => {
    it('counts only Open disputes', () => {
      const state = makeState([
        makeDispute({ id: 'a', status: DisputeStatus.Open }),
        makeDispute({ id: 'b', status: DisputeStatus.Resolved }),
      ]);
      expect(selectOpenCount(state)).toBe(1);
    });
  });

  describe('selectOpenDisputesForAgent', () => {
    it('returns only the open disputes for the given agent — used by settlements to block validation', () => {
      const state = makeState([
        makeDispute({ id: 'CT-0703-07', agent: { id: 'agent-grace-atangana', name: 'Grace Atangana', enteredAmount: 500 } }),
        makeDispute({ id: 'CT-other', agent: { id: 'agent-cedric-nkoulou', name: 'Cédric Nkoulou', enteredAmount: 700 } }),
        makeDispute({
          id: 'CT-resolved',
          status: DisputeStatus.Resolved,
          agent: { id: 'agent-grace-atangana', name: 'Grace Atangana', enteredAmount: 500 },
        }),
      ]);

      const result = selectOpenDisputesForAgent(state, 'agent-grace-atangana');

      expect(result.map((d) => d.id)).toEqual(['CT-0703-07']);
    });

    it('returns an empty array when the agent has no open dispute', () => {
      const state = makeState([makeDispute()]);
      expect(selectOpenDisputesForAgent(state, 'agent-with-no-dispute')).toEqual([]);
    });
  });

  describe('selectDisputeGap', () => {
    it('computes the absolute-signed gap between declared and entered amounts', () => {
      const dispute = makeDispute({
        agent: { id: 'agent-grace-atangana', name: 'Grace Atangana', enteredAmount: 500 },
        client: { id: 'client-1', name: 'Client Un', declaredAmount: 1_000 },
      });
      expect(selectDisputeGap(dispute)).toBe(500);
    });
  });
});
