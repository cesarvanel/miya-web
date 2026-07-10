// @vitest-environment jsdom
import { configureStore } from '@reduxjs/toolkit';
import { act, renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { Provider } from 'react-redux';
import { createModalSystem } from './createModalSystem';

type BankModal = 'confirmSettlement' | 'agentDetails';

interface BankModalProps {
  confirmSettlement: { slipId: string };
  agentDetails: undefined;
}

const { modalsSlice, openModal, useModal } = createModalSystem<
  BankModal,
  BankModalProps
>();

const makeStore = () =>
  configureStore({ reducer: { modals: modalsSlice.reducer } });

const makeWrapper =
  (store: ReturnType<typeof makeStore>) =>
  ({ children }: { children: ReactNode }) =>
    createElement(Provider, { store, children });

describe('useModal', () => {
  it('is closed with no props by default', () => {
    const store = makeStore();
    const { result } = renderHook(() => useModal('confirmSettlement'), {
      wrapper: makeWrapper(store),
    });
    expect(result.current.isOpen).toBe(false);
    expect(result.current.props).toBeUndefined();
  });

  it('opens with typed props when its type is dispatched', () => {
    const store = makeStore();
    const { result } = renderHook(() => useModal('confirmSettlement'), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      store.dispatch(
        openModal({ type: 'confirmSettlement', props: { slipId: 'slip-1' } }),
      );
    });

    expect(result.current.isOpen).toBe(true);
    expect(result.current.props).toEqual({ slipId: 'slip-1' });
  });

  it('stays closed when another modal type opens', () => {
    const store = makeStore();
    const { result } = renderHook(() => useModal('confirmSettlement'), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      store.dispatch(openModal({ type: 'agentDetails', props: undefined }));
    });

    expect(result.current.isOpen).toBe(false);
    expect(result.current.props).toBeUndefined();
  });

  it('close() dispatches closeModal', () => {
    const store = makeStore();
    const { result } = renderHook(() => useModal('confirmSettlement'), {
      wrapper: makeWrapper(store),
    });

    act(() => {
      store.dispatch(
        openModal({ type: 'confirmSettlement', props: { slipId: 'slip-1' } }),
      );
    });
    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
    expect(store.getState().modals.current).toBeNull();
  });
});
