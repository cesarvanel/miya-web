import { configureStore } from '@reduxjs/toolkit';
import { cacheSlice, requestStatusSlice } from '@miya/kernel';
import { modalsSlice } from '@/shared/modals';
import type { PlatformDependencies } from './dependencies';

/** Composition root du store platform — mêmes clés kernel que bank. */
export const makePlatformStore = (dependencies: PlatformDependencies) =>
  configureStore({
    reducer: {
      cache: cacheSlice.reducer,
      modals: modalsSlice.reducer,
      requestStatus: requestStatusSlice.reducer,
      // Reducers des modules ajoutés au fur et à mesure.
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: { extraArgument: dependencies } }),
  });

export type PlatformStore = ReturnType<typeof makePlatformStore>;
export type PlatformRootState = ReturnType<PlatformStore['getState']>;
export type PlatformDispatch = PlatformStore['dispatch'];
