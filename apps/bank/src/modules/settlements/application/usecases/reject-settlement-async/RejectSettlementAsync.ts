import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { SettlementsActions } from '../../../domain/slices/SettlementsSlice';
import { FetchSettlementQueueAsync } from '../fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { RejectSettlementCommand } from './RejectSettlementCommand';

/** Rejet : gateway → transition domaine → cache → modale → toast. */
export const RejectSettlementAsync = createBankAsyncThunk<
  void,
  RejectSettlementCommand
>(
  'settlements/rejectSettlement',
  async ({ id, reason, receivedAmount }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.settlementGateway.reject(id, { reason, receivedAmount });

      dispatch(SettlementsActions.reject({ id, reason, receivedAmount }));
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
