import { makeBankDependencies } from '@/config/stores/dependencies/dependencies';
import { FakeRealtimeClient } from '@/config/stores/socket/realtime';
import { makeBankStore } from '@/config/stores/store';
import { FetchRoundDetailAsync } from './FetchRoundDetailAsync';

const makeStore = () => makeBankStore(makeBankDependencies(), new FakeRealtimeClient());

describe('FetchRoundDetailAsync', () => {
  it('hydrates the round and its stops, including the named maquette clients', async () => {
    const store = makeStore();

    const result = await store.dispatch(FetchRoundDetailAsync({ roundId: 'agent-cedric-nkoulou' }));

    expect(result.meta.requestStatus).toBe('fulfilled');
    const state = store.getState();
    const round = state.collections.rounds.entities['agent-cedric-nkoulou'];
    expect(round?.progress).toEqual({ visited: 34, expected: 52 });

    const stops = Object.values(state.collections.stops.entities).filter(
      (stop) => stop?.roundId === 'agent-cedric-nkoulou',
    );
    expect(stops).toHaveLength(52);
    expect(stops.filter((stop) => stop?.status === 'Collected')).toHaveLength(34);

    const bernadette = state.collections.stops.entities['stop-cedric-01'];
    expect(bernadette).toMatchObject({ status: 'Collected', collectedAmount: 1_000, collectedAt: '08h26' });
  });

  it('is cached: a second call within the ttl does not refetch', async () => {
    const store = makeStore();

    await store.dispatch(FetchRoundDetailAsync({ roundId: 'agent-cedric-nkoulou' }));
    const second = await store.dispatch(FetchRoundDetailAsync({ roundId: 'agent-cedric-nkoulou' }));

    expect(second.meta.requestStatus).toBe('rejected');
    expect('condition' in second.meta && second.meta.condition).toBe(true);
  });

  it('rejects when the round does not exist', async () => {
    const store = makeStore();

    const result = await store.dispatch(FetchRoundDetailAsync({ roundId: 'missing' }));

    expect(result.meta.requestStatus).toBe('rejected');
  });
});
