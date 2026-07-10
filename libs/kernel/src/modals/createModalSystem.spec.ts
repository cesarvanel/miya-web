import { createModalSystem } from './createModalSystem';

type BankModal = 'confirmSettlement' | 'agentDetails';

interface BankModalProps {
  confirmSettlement: { slipId: string };
  agentDetails: undefined;
}

describe('createModalSystem', () => {
  const { modalsSlice, openModal, closeModal } = createModalSystem<
    BankModal,
    BankModalProps
  >();

  it('starts with no modal open', () => {
    const state = modalsSlice.reducer(undefined, { type: '@@init' });
    expect(state.current).toBeNull();
  });

  it('openModal stores the discriminated { type, props } payload', () => {
    const state = modalsSlice.reducer(
      undefined,
      openModal({ type: 'confirmSettlement', props: { slipId: 'slip-1' } }),
    );
    expect(state.current).toEqual({
      type: 'confirmSettlement',
      props: { slipId: 'slip-1' },
    });
  });

  it('opening another modal replaces the current one', () => {
    let state = modalsSlice.reducer(
      undefined,
      openModal({ type: 'confirmSettlement', props: { slipId: 'slip-1' } }),
    );
    state = modalsSlice.reducer(
      state,
      openModal({ type: 'agentDetails', props: undefined }),
    );
    expect(state.current?.type).toBe('agentDetails');
  });

  it('closeModal resets the state', () => {
    let state = modalsSlice.reducer(
      undefined,
      openModal({ type: 'confirmSettlement', props: { slipId: 'slip-1' } }),
    );
    state = modalsSlice.reducer(state, closeModal());
    expect(state.current).toBeNull();
  });

  it('namespaces its actions under the slice name', () => {
    expect(closeModal().type).toBe('modals/closeModal');
    const custom = createModalSystem<BankModal, BankModalProps>('bankModals');
    expect(custom.closeModal().type).toBe('bankModals/closeModal');
  });
});
