import { createAsyncThunk, type AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import { createCachedAsyncThunk, type CachedAsyncThunkOptions, type ErrorState } from '@miya/kernel';
import type { PlatformDependencies } from '../dependencies';
import type { PlatformDispatch, PlatformRootState } from '../store';

export interface PlatformThunkConfig {
  state: PlatformRootState;
  dispatch: PlatformDispatch;
  extra: PlatformDependencies;
  /** Toujours `getErrorState(error)` — chaque use case rejette via ce même normalizer. */
  rejectValue: ErrorState;
}

export const createPlatformAsyncThunk = createAsyncThunk.withTypes<PlatformThunkConfig>();

export const createPlatformCachedAsyncThunk = <Returned, TArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, TArg, PlatformThunkConfig>,
  options: CachedAsyncThunkOptions<TArg>,
) =>
  createCachedAsyncThunk<Returned, TArg, PlatformThunkConfig>(
    typePrefix,
    payloadCreator,
    options,
  );
