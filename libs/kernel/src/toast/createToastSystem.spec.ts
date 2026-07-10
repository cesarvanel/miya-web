import { createToastSystem } from './createToastSystem';

describe('createToastSystem', () => {
  const { toastSlice, pushToast, dismissToast } = createToastSystem();

  it('starts with an empty toast list', () => {
    const state = toastSlice.reducer(undefined, { type: '@@init' });
    expect(state.items).toEqual([]);
  });

  it('pushToast appends a toast with a generated id', () => {
    const state = toastSlice.reducer(
      undefined,
      pushToast({ variant: 'success', title: 'Reversement validé' }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      variant: 'success',
      title: 'Reversement validé',
    });
    expect(typeof state.items[0]?.id).toBe('string');
  });

  it('stacks multiple toasts in order', () => {
    let state = toastSlice.reducer(
      undefined,
      pushToast({ variant: 'success', title: 'Premier' }),
    );
    state = toastSlice.reducer(
      state,
      pushToast({ variant: 'error', title: 'Second' }),
    );
    expect(state.items.map((toast) => toast.title)).toEqual([
      'Premier',
      'Second',
    ]);
  });

  it('dismissToast removes only the matching toast', () => {
    let state = toastSlice.reducer(
      undefined,
      pushToast({ variant: 'success', title: 'Premier' }),
    );
    state = toastSlice.reducer(
      state,
      pushToast({ variant: 'error', title: 'Second' }),
    );
    const [first] = state.items;
    expect(first).toBeDefined();
    state = toastSlice.reducer(state, dismissToast(first?.id ?? ''));
    expect(state.items.map((toast) => toast.title)).toEqual(['Second']);
  });

  it('namespaces its actions under the slice name', () => {
    expect(dismissToast('id').type).toBe('toasts/dismissToast');
    const custom = createToastSystem('bankToasts');
    expect(custom.dismissToast('id').type).toBe('bankToasts/dismissToast');
  });
});
