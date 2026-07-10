import { createAction } from '@reduxjs/toolkit';
import { invalidateTags, markFetched } from '@miya/kernel';
import { makeBankDependencies } from './dependencies/dependencies';
import { clearBankListeners, startBankListening } from './middleware/Listener';
import { FakeRealtimeClient } from './socket/realtime';
import { makeBankPersistor, makeBankStore } from './store';

const makeStore = () => {
  const realtimeClient = new FakeRealtimeClient();
  const store = makeBankStore(makeBankDependencies(), realtimeClient);
  return { store, realtimeClient };
};

describe('makeBankStore', () => {
  it('mounts the kernel slices under their expected keys', () => {
    const { store } = makeStore();
    const state = store.getState();
    expect(state.cache).toEqual({ entries: {} });
    expect(state.modals).toEqual({ current: null });
    expect(state.requestStatus).toEqual({ byTypePrefix: {} });
  });

  it('dispatches realtime events straight into the store', () => {
    const { store, realtimeClient } = makeStore();
    store.dispatch(markFetched({ key: 'agents:list', tags: ['agents'] }));
    expect(store.getState().cache.entries['agents:list']).toBeDefined();

    // Événement serveur simulé → le middleware le dispatche comme action.
    realtimeClient.simulate({ type: 'cache/invalidateTags', payload: ['agents'] });

    expect(store.getState().cache.entries['agents:list']).toBeUndefined();
  });

  it('wires redux-persist on the root reducer', () => {
    const { store } = makeStore();
    makeBankPersistor(store);
    expect(store.getState()._persist).toBeDefined();
  });

  it('lets listeners react to socket events with dispatch/getState', () => {
    const { store, realtimeClient } = makeStore();
    // Event de domaine tel qu'un module le déclarera (même type que côté serveur).
    const shopChangedEvent = createAction<string>('shops/shopChanged');

    startBankListening({
      actionCreator: shopChangedEvent,
      effect: (action, { dispatch, getState }) => {
        // getState typé accessible dans l'effet…
        if (getState().cache.entries['agents:list']) {
          // …et dispatch d'un « use case » en réaction à l'événement.
          dispatch(invalidateTags([`shop:${action.payload}`, 'agents']));
        }
      },
    });

    store.dispatch(markFetched({ key: 'agents:list', tags: ['agents'] }));
    realtimeClient.simulate({ type: 'shops/shopChanged', payload: 'shop-12' });

    expect(store.getState().cache.entries['agents:list']).toBeUndefined();
    clearBankListeners();
  });

  it('lets listeners emit to the socket in reaction to a dispatched action', () => {
    const { store, realtimeClient } = makeStore();
    // Action métier telle qu'un use case la dispatcherait après confirmation serveur.
    const collectionConfirmed = createAction<{ collectionId: string }>(
      'collections/collectionConfirmed',
    );

    startBankListening({
      actionCreator: collectionConfirmed,
      effect: (action) => {
        realtimeClient.emit({
          type: 'collections/ack',
          payload: action.payload.collectionId,
        });
      },
    });

    store.dispatch(collectionConfirmed({ collectionId: 'col-1' }));

    expect(realtimeClient.emitted).toEqual([
      { type: 'collections/ack', payload: 'col-1' },
    ]);
    clearBankListeners();
  });
});
