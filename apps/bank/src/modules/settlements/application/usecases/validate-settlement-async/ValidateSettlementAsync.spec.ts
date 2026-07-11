import { FetchRoundsAsync } from '@/modules/collections';
import { FetchDaySummaryAsync } from '@/modules/dashboard';
import { FetchDisputesAsync } from '@/modules/disputes';
import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchSettlementQueueAsync } from '../fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { ValidateSettlementAsync } from './ValidateSettlementAsync';

const TODAY = new Date().toISOString().slice(0, 10);

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());

describe('ValidateSettlementAsync', () => {
  it('blocks validation when the agent has an open dispute (Grace A. · CT-0703-07 · BRD-2026-0703-02)', async () => {
    const store = makeStore();
    await store.dispatch(FetchSettlementQueueAsync({}));
    await store.dispatch(FetchDisputesAsync({}));

    const result = await store.dispatch(ValidateSettlementAsync({ id: 'BRD-2026-0703-02' }));

    expect(result.meta.requestStatus).toBe('rejected');
    if (ValidateSettlementAsync.rejected.match(result)) {
      expect(result.payload?.message).toContain('contestation ouverte');
    }
    expect(store.getState().settlements.entities['BRD-2026-0703-02']?.status).toBe(
      'PendingValidation',
    );
  });

  it('validates normally when the agent has no open dispute', async () => {
    const store = makeStore();
    await store.dispatch(FetchSettlementQueueAsync({}));
    await store.dispatch(FetchDisputesAsync({}));

    const result = await store.dispatch(ValidateSettlementAsync({ id: 'BRD-2026-0703-01' }));

    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(store.getState().settlements.entities['BRD-2026-0703-01']?.status).toBe('Validated');
  });

  it('dispatches partialDepositValidated for a PartialDeposit slip — updates collections AND dashboard (unification des events)', async () => {
    const store = makeStore();
    await store.dispatch(FetchSettlementQueueAsync({}));
    await store.dispatch(FetchDisputesAsync({}));
    await store.dispatch(FetchRoundsAsync({ date: TODAY }));
    await store.dispatch(FetchDaySummaryAsync({}));

    const roundBefore = store.getState().collections.rounds.entities['agent-cedric-nkoulou'];
    const agentBefore = store.getState().dashboard.agents.entities['agent-cedric-nkoulou'];
    expect(roundBefore?.cashInHand).toBe(85_000);
    expect(agentBefore?.cashInHand).toBe(85_000);

    const result = await store.dispatch(ValidateSettlementAsync({ id: 'DEP-2026-0703-07' }));

    expect(result.meta.requestStatus).toBe('fulfilled');
    const roundAfter = store.getState().collections.rounds.entities['agent-cedric-nkoulou'];
    const agentAfter = store.getState().dashboard.agents.entities['agent-cedric-nkoulou'];
    expect(roundAfter?.cashInHand).toBe(85_000 - 60_000);
    expect(agentAfter?.cashInHand).toBe(85_000 - 60_000);
    expect(roundAfter?.partialDeposits.some((deposit) => deposit.amount === 60_000)).toBe(true);
  });
});
