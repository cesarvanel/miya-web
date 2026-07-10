import { configureStore } from '@reduxjs/toolkit';
import { cacheSlice, invalidateTags } from './cacheSlice';
import { createCachedAsyncThunk } from './createCachedAsyncThunk';

const makeStore = () =>
  configureStore({ reducer: { cache: cacheSlice.reducer } });

describe('createCachedAsyncThunk', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('fetches when there is no cache entry and marks it fetched', async () => {
    const store = makeStore();
    const fetcher = vi.fn(async () => ['agent-1']);
    const loadAgents = createCachedAsyncThunk('agents/load', fetcher, {
      key: 'agents:list',
      tags: ['agents'],
      ttlMs: 60000,
    });

    const result = await store.dispatch(loadAgents());

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(result.meta.requestStatus).toBe('fulfilled');
    expect(result.payload).toEqual(['agent-1']);
    expect(store.getState().cache.entries['agents:list']).toEqual({
      fetchedAt: 0,
      tags: ['agents'],
    });
  });

  it('cancels via condition while the entry is fresh', async () => {
    const store = makeStore();
    const fetcher = vi.fn(async () => ['agent-1']);
    const loadAgents = createCachedAsyncThunk('agents/load', fetcher, {
      key: 'agents:list',
      ttlMs: 60000,
    });

    await store.dispatch(loadAgents());
    const second = await store.dispatch(loadAgents());

    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(second.meta.requestStatus).toBe('rejected');
    expect('condition' in second.meta && second.meta.condition).toBe(true);
  });

  it('fetches again once ttlMs has elapsed', async () => {
    const store = makeStore();
    const fetcher = vi.fn(async () => ['agent-1']);
    const loadAgents = createCachedAsyncThunk('agents/load', fetcher, {
      key: 'agents:list',
      ttlMs: 60000,
    });

    await store.dispatch(loadAgents());
    vi.setSystemTime(60000);
    await store.dispatch(loadAgents());

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('bypasses freshness when the argument carries force: true', async () => {
    const store = makeStore();
    const fetcher = vi.fn(async () => ['agent-1']);
    const loadAgents = createCachedAsyncThunk<
      string[],
      { force?: boolean } | undefined
    >('agents/load', fetcher, { key: 'agents:list', ttlMs: 60000 });

    await store.dispatch(loadAgents(undefined));
    await store.dispatch(loadAgents({ force: true }));

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('fetches again after its tags are invalidated', async () => {
    const store = makeStore();
    const fetcher = vi.fn(async () => ['agent-1']);
    const loadAgents = createCachedAsyncThunk('agents/load', fetcher, {
      key: 'agents:list',
      tags: ['agents'],
      ttlMs: 60000,
    });

    await store.dispatch(loadAgents());
    store.dispatch(invalidateTags(['agents']));
    await store.dispatch(loadAgents());

    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('derives key and tags from the argument', async () => {
    const store = makeStore();
    const fetcher = vi.fn(async (arg: { agentId: string }) => arg.agentId);
    const loadAgent = createCachedAsyncThunk<string, { agentId: string }>(
      'agents/loadOne',
      (arg) => fetcher(arg),
      {
        key: (arg) => `agents:${arg.agentId}`,
        tags: (arg) => ['agents', `agent:${arg.agentId}`],
        ttlMs: 60000,
      },
    );

    await store.dispatch(loadAgent({ agentId: 'a1' }));
    await store.dispatch(loadAgent({ agentId: 'a2' }));
    await store.dispatch(loadAgent({ agentId: 'a1' }));

    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(store.getState().cache.entries['agents:a1']?.tags).toEqual([
      'agents',
      'agent:a1',
    ]);
  });

  it('does not mark fetched when the payload creator rejects with value', async () => {
    const store = makeStore();
    const fetcher = vi.fn();
    const loadAgents = createCachedAsyncThunk(
      'agents/load',
      (_arg: void, { rejectWithValue }) => {
        fetcher();
        return rejectWithValue({ message: 'network down' });
      },
      { key: 'agents:list', ttlMs: 60000 },
    );

    const result = await store.dispatch(loadAgents());

    expect(result.meta.requestStatus).toBe('rejected');
    expect(result.payload).toEqual({ message: 'network down' });
    expect(store.getState().cache.entries['agents:list']).toBeUndefined();

    await store.dispatch(loadAgents());
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('does not mark fetched when the payload creator throws', async () => {
    const store = makeStore();
    const loadAgents = createCachedAsyncThunk(
      'agents/load',
      async () => {
        throw new Error('boom');
      },
      { key: 'agents:list', ttlMs: 60000 },
    );

    const result = await store.dispatch(loadAgents());

    expect(result.meta.requestStatus).toBe('rejected');
    expect(store.getState().cache.entries['agents:list']).toBeUndefined();
  });
});
