import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  createCachedAsyncThunk,
  type CachedAsyncThunkOptions,
  type ErrorState,
} from '@miya/kernel';
import type { AsyncThunkPayloadCreator } from '@reduxjs/toolkit';
import type { BankDependencies } from '@/config/stores/dependencies/dependencies';
import type { BankDispatch, BankRootState } from '@/config/stores/store';

export interface BankThunkConfig {
  state: BankRootState;
  dispatch: BankDispatch;
  extra: BankDependencies;
  /** Toujours `getErrorState(error)` — chaque use case rejette via ce même normalizer. */
  rejectValue: ErrorState;
}

export const createBankAsyncThunk = createAsyncThunk.withTypes<BankThunkConfig>();

export const createBankCachedAsyncThunk = <Returned, TArg = void>(
  typePrefix: string,
  payloadCreator: AsyncThunkPayloadCreator<Returned, TArg, BankThunkConfig>,
  options: CachedAsyncThunkOptions<TArg>,
) =>
  createCachedAsyncThunk<Returned, TArg, BankThunkConfig>(
    typePrefix,
    payloadCreator,
    options,
  );
