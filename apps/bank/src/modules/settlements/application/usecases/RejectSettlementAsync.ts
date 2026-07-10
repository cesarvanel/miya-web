import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { reject } from '../../domain/slices/SettlementsSlice';
import { FetchSettlementQueueAsync } from './fetch-settlement-queue-async/FetchSettlementQueueAsync';

export interface RejectSettlementArg {
  id: string;
  reason: string;
  receivedAmount: number;
}

/** Rejet : gateway → transition domaine → cache → modale → toast. */
export const RejectSettlementAsync = createBankAsyncThunk<void, RejectSettlementArg>(
  'settlements/rejectSettlement',
  async ({ id, reason, receivedAmount }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.settlementGateway.reject(id, { reason, receivedAmount });

      dispatch(reject({ id, reason, receivedAmount }));
      dispatch(invalidateTags(['SettlementQueue', `Slip:${id}`]));
      dispatch(FetchSettlementQueueAsync({ force: true }));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'error',
          title: 'Reversement rejeté',
          message: "L'agent a été notifié.",
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
