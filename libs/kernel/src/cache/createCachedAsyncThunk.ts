import {
  createAsyncThunk,
  type AsyncThunk,
  type AsyncThunkConfig,
  type AsyncThunkPayloadCreator,
  type GetThunkAPI,
} from '@reduxjs/toolkit';
import { cacheSlice, markFetched, type CacheState } from './cacheSlice';

export interface ForceAbleArg {
  force?: boolean;
}

export interface CachedAsyncThunkOptions<TArg> {
  key: string | ((arg: TArg) => string);
  tags?: string[] | ((arg: TArg) => string[]);
  ttlMs: number;
}

const isForced = (arg: unknown): boolean =>
  typeof arg === 'object' && arg !== null && (arg as ForceAbleArg).force === true;

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
 
    let didRejectWithValue = false;
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

 
  return thunk as unknown as AsyncThunk<Returned, TArg, TConfig>;
};
