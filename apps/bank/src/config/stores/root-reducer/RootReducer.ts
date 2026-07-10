import { combineReducers } from '@reduxjs/toolkit';
import { cacheSlice, requestStatusSlice } from '@miya/kernel';
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
  // Reducers des autres modules ajoutés au fur et à mesure :
  // dashboard: dashboardReducer, …
});

/** State métier (sans la clé _persist ajoutée par redux-persist). */
export type BankState = ReturnType<typeof rootReducer>;
