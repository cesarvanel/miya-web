import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchRoundsAsync } from './FetchRoundsAsync';

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());
const TODAY = new Date().toISOString().slice(0, 10);

describe('FetchRoundsAsync', () => {
  it('hydrates the collections slice with the 5 rounds matching the dashboard fixture', async () => {
    const store = makeStore();

    const result = await store.dispatch(FetchRoundsAsync({ date: TODAY }));

    expect(result.meta.requestStatus).toBe('fulfilled');
    const state = store.getState();
    expect(state.collections.rounds.ids).toHaveLength(5);

    const cedric = state.collections.rounds.entities['agent-cedric-nkoulou'];
    expect(cedric).toMatchObject({
      status: 'Open',
      progress: { visited: 34, expected: 52 },
      collectedTotal: 34_200,
      cashInHand: 85_000,
    });

    const ibrahim = state.collections.rounds.entities['agent-ibrahim-sali'];
    expect(ibrahim?.status).toBe('Closed');
    expect(ibrahim?.partialDeposits[0]).toMatchObject({ amount: 20_000, validatedAt: '11h02' });
  });

  it('is cached: a second call within the ttl does not refetch', async () => {
    const store = makeStore();

    await store.dispatch(FetchRoundsAsync({ date: TODAY }));
    const second = await store.dispatch(FetchRoundsAsync({ date: TODAY }));

    expect(second.meta.requestStatus).toBe('rejected');
    expect('condition' in second.meta && second.meta.condition).toBe(true);
  });

  it('bypasses the cache when force is true', async () => {
    const store = makeStore();

    await store.dispatch(FetchRoundsAsync({ date: TODAY }));
    const second = await store.dispatch(FetchRoundsAsync({ date: TODAY, force: true }));

    expect(second.meta.requestStatus).toBe('fulfilled');
  });
});
