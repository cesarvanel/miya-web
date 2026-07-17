import { combineReducers, type Reducer, type UnknownAction } from '@reduxjs/toolkit';
import { cacheSlice, requestStatusSlice } from '@miya/kernel';
import { authReducer, LogoutAsync } from '@/modules/auth';
import { overviewReducer } from '@/modules/overview';
import { tenantsReducer } from '@/modules/tenants';
import { modalsSlice } from '@/shared/modals';
import { toastSlice } from '@/shared/toasts';

/**
 * Root reducer de l'app platform. Les clés `cache`, `modals`, `toasts` et
 * `requestStatus` sont celles attendues par le kernel (createCachedAsyncThunk,
 * useModal, useToasts, useRequestStatus).
 */
const appReducer = combineReducers({
  cache: cacheSlice.reducer,
  modals: modalsSlice.reducer,
  toasts: toastSlice.reducer,
  requestStatus: requestStatusSlice.reducer,
  auth: authReducer,
  overview: overviewReducer,
  tenants: tenantsReducer,
  // Reducers des autres modules ajoutés au fur et à mesure.
});

/** State métier (sans la clé _persist ajoutée par redux-persist). */
export type PlatformState = ReturnType<typeof appReducer>;

/** Déconnexion = reset intégral du store (chaque slice repart de son état initial). */
export const rootReducer: Reducer<PlatformState, UnknownAction> = (state, action) =>
  appReducer(action.type === LogoutAsync.fulfilled.type ? undefined : state, action);
