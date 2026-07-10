import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { settlementValidated } from '../../../domain/events/Events';
import { selectSlipById } from '../../../domain/selectors/Selectors';
import { SettlementsActions } from '../../../domain/slices/SettlementsSlice';
import { FetchSettlementQueueAsync } from '../fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { ValidateSettlementCommand } from './ValidateSettlementCommand';
import { ValidateSettlementResponse } from './ValidateSettlementResponse';

/** Validation croisée : gateway → transition domaine → cache → modale → toast. */
export const ValidateSettlementAsync = createBankAsyncThunk<
  ValidateSettlementResponse,
  ValidateSettlementCommand
>(
  'settlements/validateSettlement',
  async ({ id }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const result = await extra.settlementGateway.validate(id);
      const agentId = selectSlipById(getState(), id)?.agentId ?? '';

      dispatch(SettlementsActions.validate({ id }));
      dispatch(settlementValidated({ slipId: id, agentId }));
      dispatch(invalidateTags(['SettlementQueue', `Slip:${id}`]));
      dispatch(FetchSettlementQueueAsync({ force: true }));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Reversement validé',
          message: `Quittance ${result.receiptNumber} émise.`,
        }),
      );

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
