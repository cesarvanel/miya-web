import { combineReducers } from '@reduxjs/toolkit';
import { cacheSlice, requestStatusSlice } from '@miya/kernel';
import { collectionsReducer } from '@/modules/collections';
import { dashboardReducer } from '@/modules/dashboard';
import { disputesReducer } from '@/modules/disputes';
import { settlementsReducer } from '@/modules/settlements';
import { modalsSlice } from '@/shared/modals';
import { toastSlice } from '@/shared/toasts';

/**
 * Root reducer de l'app bank. Les clés `cache`, `modals`, `toasts` et
 * `requestStatus` sont celles attendues par le kernel (createCachedAsyncThunk,
 * useModal, useToasts, useRequestStatus).
 */
export const rootReducer = combineReducers({
  cache: cacheSlice.reducer,
  modals: modalsSlice.reducer,
  toasts: toastSlice.reducer,
  requestStatus: requestStatusSlice.reducer,
  settlements: settlementsReducer,
  dashboard: dashboardReducer,
  disputes: disputesReducer,
  collections: collectionsReducer,
  // Reducers des autres modules ajoutés au fur et à mesure.
});

/** State métier (sans la clé _persist ajoutée par redux-persist). */
export type BankState = ReturnType<typeof rootReducer>;
