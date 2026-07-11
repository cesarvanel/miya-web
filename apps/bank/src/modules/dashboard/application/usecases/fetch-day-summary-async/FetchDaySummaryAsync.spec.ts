import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchDaySummaryAsync } from './FetchDaySummaryAsync';

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());

describe('FetchDaySummaryAsync', () => {
  it('hydrates the dashboard slice with the agents and activity from the gateway', async () => {
    const store = makeStore();

    const result = await store.dispatch(FetchDaySummaryAsync({}));

    expect(result.meta.requestStatus).toBe('fulfilled');
    const state = store.getState();
    expect(state.dashboard.agents.ids).toHaveLength(5);
    expect(state.dashboard.activity.ids).toHaveLength(5);

    const ibrahim = state.dashboard.agents.entities['agent-ibrahim-sali'];
    expect(ibrahim).toMatchObject({
      status: 'settlementPending',
      slipId: 'BRD-2026-0703-01',
      collectedAmount: 44_500,
    });
  });

  it('is cached: a second call within the ttl does not refetch', async () => {
    const store = makeStore();

    await store.dispatch(FetchDaySummaryAsync({}));
    const second = await store.dispatch(FetchDaySummaryAsync({}));

    expect(second.meta.requestStatus).toBe('rejected');
    expect('condition' in second.meta && second.meta.condition).toBe(true);
  });

  it('bypasses the cache when force is true', async () => {
    const store = makeStore();

    await store.dispatch(FetchDaySummaryAsync({}));
    const second = await store.dispatch(FetchDaySummaryAsync({ force: true }));

    expect(second.meta.requestStatus).toBe('fulfilled');
  });
});
