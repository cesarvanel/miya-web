import { DisputesAdapter, DisputeStatus, type Dispute } from '../entities/Dispute';
import { disputeOpened } from '../events/Events';
import { disputesSlice, DisputesActions } from './DisputesSlice';

const makeDispute = (overrides: Partial<Dispute> = {}): Dispute => ({
  id: 'CT-1',
  openedAt: new Date().toISOString(),
  zone: 'Zone',
  status: DisputeStatus.Open,
  agent: { id: 'agent-1', name: 'Agent Un', enteredAmount: 500 },
  client: { id: 'client-1', name: 'Client Un', declaredAmount: 1_000 },
  clientHistory: { regularity: { onTime: 29, total: 30 }, disputesLast12Months: 0, clientSince: '2022' },
  agentHistory: { confirmationRate: 98.4, disputesLast12Months: 3, settlementGaps: 1 },
  resolution: null,
  ...overrides,
});

const stateWithDispute = (dispute: Dispute) => {
  const initial = disputesSlice.reducer(undefined, { type: '@@init' });
  return DisputesAdapter.setAll(initial, [dispute]);
};

describe('disputesSlice', () => {
  it('starts empty', () => {
    const state = disputesSlice.reducer(undefined, { type: '@@init' });
    expect(state.ids).toEqual([]);
  });

  describe('disputeOpened (temps réel)', () => {
    it('creates a new Open dispute from the event payload', () => {
      const state = disputesSlice.reducer(
        undefined,
        disputeOpened({
          zone: 'Nkolbisson',
          agent: { id: 'agent-innocent-ateba', name: 'Innocent Ateba', enteredAmount: 700 },
          client: { id: 'client-fabrice-ondoa', name: 'Fabrice Ondoa', declaredAmount: 1_200 },
          clientHistory: { regularity: { onTime: 18, total: 20 }, disputesLast12Months: 1, clientSince: '2024' },
          agentHistory: { confirmationRate: 95.2, disputesLast12Months: 2, settlementGaps: 0 },
        }),
      );

      expect(state.ids).toHaveLength(1);
      const dispute = state.entities[state.ids[0] as string];
      expect(dispute).toMatchObject({
        status: DisputeStatus.Open,
        zone: 'Nkolbisson',
        resolution: null,
      });
      expect(dispute?.agent.name).toBe('Innocent Ateba');
    });
  });

  describe('resolveForClient / resolveForAgent', () => {
    it('resolveForClient sets status Resolved and records the resolution', () => {
      const state = stateWithDispute(makeDispute());

      const next = disputesSlice.reducer(
        state,
        DisputesActions.resolveForClient({ id: 'CT-1', reason: 'Reçu SMS présenté.', decidedBy: 'A. Mbarga' }),
      );

      const dispute = next.entities['CT-1'];
      expect(dispute?.status).toBe(DisputeStatus.Resolved);
      expect(dispute?.resolution).toMatchObject({
        decidedInFavorOf: 'Client',
        reason: 'Reçu SMS présenté.',
        decidedBy: 'A. Mbarga',
      });
      expect(dispute?.resolution?.decidedAt).toBeDefined();
    });

    it('resolveForAgent sets status Resolved in favor of the agent', () => {
      const state = stateWithDispute(makeDispute());

      const next = disputesSlice.reducer(
        state,
        DisputesActions.resolveForAgent({ id: 'CT-1', reason: 'Montant confirmé.', decidedBy: 'A. Mbarga' }),
      );

      expect(next.entities['CT-1']?.resolution?.decidedInFavorOf).toBe('Agent');
    });

    it('is immutable: resolving an already-resolved dispute is a no-op', () => {
      const resolved = makeDispute({
        status: DisputeStatus.Resolved,
        resolution: {
          decidedInFavorOf: 'Agent',
          reason: 'Première décision.',
          decidedBy: 'A. Mbarga',
          decidedAt: '2026-07-03T09:00:00.000Z',
        },
      });
      const state = stateWithDispute(resolved);

      const next = disputesSlice.reducer(
        state,
        DisputesActions.resolveForClient({ id: 'CT-1', reason: 'Nouvelle tentative.', decidedBy: 'Quelqu’un d’autre' }),
      );

      expect(next.entities['CT-1']?.resolution).toEqual(resolved.resolution);
    });

    it('does nothing when the dispute does not exist', () => {
      const state = disputesSlice.reducer(undefined, { type: '@@init' });
      const next = disputesSlice.reducer(
        state,
        DisputesActions.resolveForClient({ id: 'missing', reason: 'x', decidedBy: 'A. Mbarga' }),
      );
      expect(next.ids).toEqual([]);
    });
  });
});
