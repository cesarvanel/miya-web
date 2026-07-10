// @vitest-environment jsdom
import { configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { requestStatusSlice } from './requestStatusSlice';
import { useRequestStatus } from './useRequestStatus';

const makeStore = () =>
  configureStore({ reducer: { requestStatus: requestStatusSlice.reducer } });

const makeWrapper =
  (store: ReturnType<typeof makeStore>) =>
  ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store, children });

describe('useRequestStatus', () => {
  it('reports idle, then pending, then fulfilled', async () => {
    const store = makeStore();
    let resolve!: (value: string) => void;
    const loadAgents = createAsyncThunk(
      'agents/load',
      () => new Promise<string>((res) => (resolve = res)),
    );

    const { result } = renderHook(() => useRequestStatus(loadAgents), {
      wrapper: makeWrapper(store),
    });
    expect(result.current.isIdle).toBe(true);
    expect(result.current.status).toBe('idle');

    let promise!: Promise<unknown>;
    act(() => {
      promise = store.dispatch(loadAgents());
    });
    expect(result.current.isPending).toBe(true);

    await act(async () => {
      resolve('ok');
      await promise;
    });
    expect(result.current.isFulfilled).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('exposes the rejection error', async () => {
    const store = makeStore();
    const failing = createAsyncThunk('agents/fail', (_: void, { rejectWithValue }) =>
      rejectWithValue({ message: 'network down' }),
    );

    const { result } = renderHook(() => useRequestStatus(failing), {
      wrapper: makeWrapper(store),
    });

    await act(async () => {
      await store.dispatch(failing());
    });

    expect(result.current.isRejected).toBe(true);
    expect(result.current.error).toEqual({ message: 'network down' });
  });
});
