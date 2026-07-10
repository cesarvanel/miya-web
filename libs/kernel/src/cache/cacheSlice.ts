import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface CacheEntry {
  fetchedAt: number;
  tags: string[];
}

export interface CacheState {
  entries: Record<string, CacheEntry>;
}

export interface MarkFetchedInput {
  key: string;
  tags?: string[];
  /** Defaults to `Date.now()`; injectable for tests. */
  fetchedAt?: number;
}

const initialState: CacheState = { entries: {} };

/**
 * Builds the cache slice tracking data freshness per cache key.
 * Apps mount the default instance (`cacheSlice.reducer`) under the `cache`
 * key of their store — `createCachedAsyncThunk` reads it there.
 */
export const cacheSliceFactory = (name = 'cache') =>
  createSlice({
    name,
    initialState,
    reducers: {
      markFetched: {
        reducer: (
          state,
          action: PayloadAction<Required<MarkFetchedInput>>,
        ) => {
          const { key, tags, fetchedAt } = action.payload;
          state.entries[key] = { fetchedAt, tags };
        },
        prepare: (input: MarkFetchedInput) => ({
          payload: {
            key: input.key,
            tags: input.tags ?? [],
            fetchedAt: input.fetchedAt ?? Date.now(),
          },
        }),
      },
      invalidateTags: (state, action: PayloadAction<string[]>) => {
        const tags = action.payload;
        for (const key of Object.keys(state.entries)) {
          const entry = state.entries[key];
          if (entry && entry.tags.some((tag) => tags.includes(tag))) {
            delete state.entries[key];
          }
        }
      },
    },
  });

export const cacheSlice = cacheSliceFactory();

export const { markFetched, invalidateTags } = cacheSlice.actions;
