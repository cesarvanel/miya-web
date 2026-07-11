import { FetchDisputesAsync } from '@/modules/disputes';
import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchSettlementQueueAsync } from '../fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { ValidateSettlementAsync } from './ValidateSettlementAsync';

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
});
