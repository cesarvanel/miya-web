import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { requestStatusSlice } from './requestStatusSlice';

const makeStore = () =>
  configureStore({ reducer: { requestStatus: requestStatusSlice.reducer } });

const entryOf = (store: ReturnType<typeof makeStore>, typePrefix: string) =>
  store.getState().requestStatus.byTypePrefix[typePrefix];

describe('requestStatusSlice', () => {
  it('is idle (absent) before any request', () => {
    const store = makeStore();
    expect(entryOf(store, 'agents/load')).toBeUndefined();
  });

  it('tracks pending then fulfilled, indexed by typePrefix', async () => {
    const store = makeStore();
    let resolve!: (value: string) => void;
    const loadAgents = createAsyncThunk(
      'agents/load',
      () => new Promise<string>((res) => (resolve = res)),
    );

    const promise = store.dispatch(loadAgents());
    expect(entryOf(store, 'agents/load')).toEqual({
      status: 'pending',
      error: null,
    });

    resolve('ok');
    await promise;
    expect(entryOf(store, 'agents/load')).toEqual({
      status: 'fulfilled',
      error: null,
    });
  });

  it('tracks rejection and keeps the rejectWithValue payload as error', async () => {
    const store = makeStore();
    const failing = createAsyncThunk('agents/fail', (_: void, { rejectWithValue }) =>
      rejectWithValue({ message: 'network down' }),
    );

    await store.dispatch(failing());

    expect(entryOf(store, 'agents/fail')).toEqual({
      status: 'rejected',
      error: { message: 'network down' },
    });
  });

  it('stores the SerializedError when the thunk throws', async () => {
    const store = makeStore();
    const throwing = createAsyncThunk('agents/throw', async () => {
      throw new Error('boom');
    });

    await store.dispatch(throwing());

    const entry = entryOf(store, 'agents/throw');
    expect(entry?.status).toBe('rejected');
    expect((entry?.error as { message?: string }).message).toBe('boom');
  });

  it('tracks each typePrefix independently', async () => {
    const store = makeStore();
    const a = createAsyncThunk('a/load', async () => 'a');
    const b = createAsyncThunk('b/load', async () => {
      throw new Error('b failed');
    });

    await Promise.all([store.dispatch(a()), store.dispatch(b())]);

    expect(entryOf(store, 'a/load')?.status).toBe('fulfilled');
    expect(entryOf(store, 'b/load')?.status).toBe('rejected');
  });

  it('ignores condition-cancelled rejections', () => {
    const store = makeStore();
    const cancelled = {
      type: 'agents/load/rejected',
      payload: undefined,
      error: { name: 'ConditionError' },
      meta: {
        requestId: 'r1',
        requestStatus: 'rejected',
        condition: true,
        arg: undefined,
        aborted: false,
        rejectedWithValue: false,
      },
    };

    store.dispatch(cancelled);

    expect(entryOf(store, 'agents/load')).toBeUndefined();
  });
});
