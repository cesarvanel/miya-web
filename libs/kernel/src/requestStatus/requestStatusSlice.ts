import {
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
} from '@reduxjs/toolkit';

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export interface RequestStatusEntry {
  status: RequestStatus;
  /** Serializable rejection detail: `rejectWithValue` payload, else the SerializedError. */
  error: unknown;
}

export interface RequestStatusState {
  byTypePrefix: Record<string, RequestStatusEntry>;
}

const initialState: RequestStatusState = { byTypePrefix: {} };

const typePrefixOf = (actionType: string): string =>
  actionType.slice(0, actionType.lastIndexOf('/'));

/**
 * Tracks the lifecycle of every async thunk, indexed by its typePrefix.
 * Fed by the generic isPending/isFulfilled/isRejected matchers — no
 * per-thunk wiring needed. Mount the reducer under `requestStatus`.
 */
export const requestStatusSlice = createSlice({
  name: 'requestStatus',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(isPending(), (state, action) => {
        state.byTypePrefix[typePrefixOf(action.type)] = {
          status: 'pending',
          error: null,
        };
      })
      .addMatcher(isFulfilled(), (state, action) => {
        state.byTypePrefix[typePrefixOf(action.type)] = {
          status: 'fulfilled',
          error: null,
        };
      })
      .addMatcher(isRejected(), (state, action) => {
        if (action.meta.condition) {
          // Cancelled before running (e.g. fresh cache): not a failure.
          return;
        }
        state.byTypePrefix[typePrefixOf(action.type)] = {
          status: 'rejected',
          error: action.payload ?? action.error,
        };
      });
  },
});
