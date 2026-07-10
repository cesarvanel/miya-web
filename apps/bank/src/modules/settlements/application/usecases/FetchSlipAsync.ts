import { getErrorState, type ForceAbleArg } from '@miya/kernel';
import { createBankCachedAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { slipLoaded } from '../../domain/slices/SettlementsSlice';
import type { SettlementSlip } from '../../domain/entities/SettlementSlip';

export interface FetchSlipArg extends ForceAbleArg {
  id: string;
}

export const FetchSlipAsync = createBankCachedAsyncThunk<SettlementSlip, FetchSlipArg>(
  'settlements/fetchSlip',
  async ({ id }, { extra, dispatch, rejectWithValue }) => {
    try {
      const slip = await extra.settlementGateway.fetchSlip(id);
      dispatch(slipLoaded(slip));
      return slip;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
  {
    key: (arg) => `slip:${arg.id}`,
    tags: (arg) => ['Slip', `Slip:${arg.id}`],
    ttlMs: 30_000,
  },
);
