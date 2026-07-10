import {
  createAsyncThunk,
  type AsyncThunk,
  type AsyncThunkConfig,
  type AsyncThunkPayloadCreator,
  type GetThunkAPI,
} from '@reduxjs/toolkit';
import { cacheSlice, markFetched, type CacheState } from './cacheSlice';

/** Cached use case arguments may carry `force: true` to bypass freshness. */
export interface ForceableArg {
  force?: boolean;
}

export interface CachedAsyncThunkOptions<TArg> {
  /** Cache entry key, static or derived from the thunk argument. */
  key: string | ((arg: TArg) => string);
  /** Tags letting mutations evict this entry via `invalidateTags`. */
  tags?: string[] | ((arg: TArg) => string[]);
  /** Freshness window: a fresh entry cancels the thunk unless forced. */
  ttlMs: number;
}

const isForced = (arg: unknown): boolean =>
  typeof arg === 'object' && arg !== null && (arg as ForceableArg).force === true;

/**
 * `createAsyncThunk` with declarative caching. The thunk is cancelled via
 * `condition` while its cache entry is fresher than `ttlMs` (unless the
 * argument carries `force: true`), and the entry's `fetchedAt` is marked
 * when the payload creator fulfills (not when it rejects).
 */
export const createCachedAsyncThunk = <
  Returned,
  TArg = void,
  TConfig extends AsyncThunkConfig = AsyncThunkConfig,
>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, TArg, TConfig>,
  options: CachedAsyncThunkOptions<TArg>,
): AsyncThunk<Returned, TArg, TConfig> => {
  const resolveKey = (arg: TArg): string =>
    typeof options.key === 'function' ? options.key(arg) : options.key;
  const resolveTags = (arg: TArg): string[] =>
    typeof options.tags === 'function' ? options.tags(arg) : options.tags ?? [];

  const cachedPayloadCreator = async (
    arg: TArg,
    thunkApi: GetThunkAPI<AsyncThunkConfig>,
  ) => {
    // Intercept rejectWithValue so a `return rejectWithValue(...)` from the
    // wrapped creator never marks the cache entry as fetched.
    let didRejectWithValue = false;
    // Loosen the signature: the optional rejectedMeta argument only exists
    // for configs declaring it, which TConfig may.
    const rejectWithValue = thunkApi.rejectWithValue as (
      value: unknown,
      meta?: unknown,
    ) => ReturnType<typeof thunkApi.rejectWithValue>;
    const guardedApi = {
      ...thunkApi,
      rejectWithValue: ((value: unknown, meta?: unknown) => {
        didRejectWithValue = true;
        return rejectWithValue(value, meta);
      }) as typeof thunkApi.rejectWithValue,
    };
    const result = await payloadCreator(
      arg,
      guardedApi as Parameters<typeof payloadCreator>[1],
    );
    if (!didRejectWithValue) {
      thunkApi.dispatch(
        markFetched({ key: resolveKey(arg), tags: resolveTags(arg) }),
      );
    }
    return result;
  };

  const thunk = createAsyncThunk<Returned, TArg>(
    typePrefix,
    cachedPayloadCreator as AsyncThunkPayloadCreator<Returned, TArg>,
    {
      condition: (arg, { getState }) => {
        if (isForced(arg)) {
          return true;
        }
        const state = getState() as Record<string, unknown>;
        const cache = state[cacheSlice.name] as CacheState | undefined;
        const entry = cache?.entries[resolveKey(arg)];
        if (!entry) {
          return true;
        }
        return Date.now() - entry.fetchedAt >= options.ttlMs;
      },
    },
  );

  // Built with the loose default config internally: RTK normalizes TConfig
  // through conditional types a wrapper cannot preserve. Runtime behavior is
  // identical; the caller-facing type keeps the caller's TConfig.
  return thunk as unknown as AsyncThunk<Returned, TArg, TConfig>;
};
