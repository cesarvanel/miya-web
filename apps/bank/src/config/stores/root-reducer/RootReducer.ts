import { combineReducers, type Reducer, type UnknownAction } from '@reduxjs/toolkit';
import { cacheSlice, requestStatusSlice } from '@miya/kernel';
import { authReducer, LogoutAsync } from '@/modules/auth';
import { clientsReducer } from '@/modules/clients';
import { collectionsReducer } from '@/modules/collections';
import { dashboardReducer } from '@/modules/dashboard';
import { disputesReducer } from '@/modules/disputes';
import { profileReducer } from '@/modules/profile';
import { agenciesReducer, agentsReducer, settingsReducer, supervisionReducer } from '@/modules/settings';
import { settlementsReducer } from '@/modules/settlements';
import { withdrawalsReducer } from '@/modules/withdrawals';
import { modalsSlice } from '@/shared/modals';
import { toastSlice } from '@/shared/toasts';

/**
 * Root reducer de l'app bank. Les clés `cache`, `modals`, `toasts` et
 * `requestStatus` sont celles attendues par le kernel (createCachedAsyncThunk,
 * useModal, useToasts, useRequestStatus).
 */
const appReducer = combineReducers({
  cache: cacheSlice.reducer,
  modals: modalsSlice.reducer,
  toasts: toastSlice.reducer,
  requestStatus: requestStatusSlice.reducer,
  auth: authReducer,
  profile: profileReducer,
  settlements: settlementsReducer,
  dashboard: dashboardReducer,
  disputes: disputesReducer,
  collections: collectionsReducer,
  clients: clientsReducer,
  agents: agentsReducer,
  withdrawals: withdrawalsReducer,
  settings: settingsReducer,
  agencies: agenciesReducer,
  supervision: supervisionReducer,
  // Reducers des autres modules ajoutés au fur et à mesure.
});

/** State métier (sans la clé _persist ajoutée par redux-persist). */
export type BankState = ReturnType<typeof appReducer>;

/** Déconnexion = reset intégral du store (chaque slice repart de son état initial). */
export const rootReducer: Reducer<BankState, UnknownAction> = (state, action) =>
  appReducer(action.type === LogoutAsync.fulfilled.type ? undefined : state, action);
