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
import type { PlatformDependencies } from './dependencies';
import { rootReducer } from './root-reducer';

/**
 * redux-persist : seule `auth` est persistée (la session survit à un reload) —
 * `cache`, `modals` et `requestStatus` restent éphémères par nature.
 */
const persistedReducer = persistReducer(
  {
    key: 'miya-platform',
    storage,
    whitelist: ['auth'],
  },
  rootReducer,
);

/** Composition root du store platform. */
export const makePlatformStore = (dependencies: PlatformDependencies) =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: dependencies },
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
  });

export const makePlatformPersistor = (store: PlatformStore) => persistStore(store);

export type PlatformStore = ReturnType<typeof makePlatformStore>;
export type PlatformRootState = ReturnType<PlatformStore['getState']>;
export type PlatformDispatch = PlatformStore['dispatch'];
