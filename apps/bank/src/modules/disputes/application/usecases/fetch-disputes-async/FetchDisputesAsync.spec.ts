import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchDisputesAsync } from './FetchDisputesAsync';

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());

describe('FetchDisputesAsync', () => {
  it('hydrates the disputes slice with open and resolved disputes from the gateway', async () => {
    const store = makeStore();

    const result = await store.dispatch(FetchDisputesAsync({}));

    expect(result.meta.requestStatus).toBe('fulfilled');
    const state = store.getState();
    expect(state.disputes.ids).toHaveLength(3);

    const grace = state.disputes.entities['CT-0703-07'];
    expect(grace).toMatchObject({
      status: 'Open',
      agent: { id: 'agent-grace-atangana', enteredAmount: 500 },
      client: { name: 'Christine Eyenga', declaredAmount: 1_000 },
    });

    const resolved = state.disputes.entities['CT-0703-04'];
    expect(resolved?.status).toBe('Resolved');
    expect(resolved?.resolution?.decidedInFavorOf).toBe('Agent');
  });

  it('is cached: a second call within the ttl does not refetch', async () => {
    const store = makeStore();

    await store.dispatch(FetchDisputesAsync({}));
    const second = await store.dispatch(FetchDisputesAsync({}));

    expect(second.meta.requestStatus).toBe('rejected');
    expect('condition' in second.meta && second.meta.condition).toBe(true);
  });

  it('bypasses the cache when force is true', async () => {
    const store = makeStore();

    await store.dispatch(FetchDisputesAsync({}));
    const second = await store.dispatch(FetchDisputesAsync({ force: true }));

    expect(second.meta.requestStatus).toBe('fulfilled');
  });
});
