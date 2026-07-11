import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { openModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { settlementValidated } from '../../../domain/events/Events';
import { selectSlipById } from '../../../domain/selectors/Selectors';
import { SettlementsActions } from '../../../domain/slices/SettlementsSlice';
import { FetchSettlementQueueAsync } from '../fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { ValidateSettlementCommand } from './ValidateSettlementCommand';
import { ValidateSettlementResponse } from './ValidateSettlementResponse';

/** Validation croisée : gateway → transition domaine → cache → modale de succès → toast. */
export const ValidateSettlementAsync = createBankAsyncThunk<
  ValidateSettlementResponse,
  ValidateSettlementCommand
>(
  'settlements/validateSettlement',
  async ({ id }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const slip = selectSlipById(getState(), id);
      const result = await extra.settlementGateway.validate(id);

      dispatch(SettlementsActions.validate({ id }));
      dispatch(settlementValidated({ slipId: id, agentId: slip?.agentId ?? '' }));
      dispatch(invalidateTags(['SettlementQueue', `Slip:${id}`]));
      dispatch(FetchSettlementQueueAsync({ force: true }));
      dispatch(
        openModal({
          type: 'validationSuccess',
          props: {
            agentName: slip?.agentName ?? '',
            slipNumber: slip?.slipNumber ?? '',
            amount: slip?.expectedAmount ?? 0,
            receiptNumber: result.receiptNumber,
          },
        }),
      );
      dispatch(
        pushToast({
          variant: 'success',
          title: `Quittance ${result.receiptNumber} émise`,
          message: `Envoyée à ${slip?.agentName ?? "l'agent"} · reçue sur son téléphone.`,
        }),
      );

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
