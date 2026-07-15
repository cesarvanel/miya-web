import { configureStore } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
  persistStore,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import type { BankDependencies } from './dependencies/dependencies';
import { bankListenerMiddleware } from './middleware/Listener';
import { makeBankMiddlewares } from './middleware/Middleware';
import { rootReducer } from './root-reducer/RootReducer';
import type { RealtimeClient } from './socket/realtime';

/**
 * redux-persist : seule `auth` est persistée (la session survit à un reload) —
 * `cache`, `modals` et `requestStatus` restent éphémères par nature (persister
 * `cache` sans les entités ferait sauter des fetchs au reload).
 */
const persistedReducer = persistReducer(
  {
    key: 'miya-bank',
    storage,
    whitelist: ['auth'],
  },
  rootReducer,
);

/** Composition root du store bank. */
export const makeBankStore = (
  dependencies: BankDependencies,
  realtimeClient: RealtimeClient,
) =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      })
        .prepend(bankListenerMiddleware.middleware)
        .concat(makeBankMiddlewares({ dependencies, realtimeClient })),
  });

export const makeBankPersistor = (store: BankStore) => persistStore(store);

export type BankStore = ReturnType<typeof makeBankStore>;
export type BankRootState = ReturnType<BankStore['getState']>;
export type BankDispatch = BankStore['dispatch'];
