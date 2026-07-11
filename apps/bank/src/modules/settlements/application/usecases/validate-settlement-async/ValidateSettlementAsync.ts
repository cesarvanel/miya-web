import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { partialDepositValidated } from '@/modules/collections';
import { disputesSelectors } from '@/modules/disputes';
import { openModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { settlementValidated } from '../../../domain/events/Events';
import { selectSlipById } from '../../../domain/selectors/Selectors';
import { SettlementsActions } from '../../../domain/slices/SettlementsSlice';
import { SettlementKind } from '../../../domain/entities/SettlementSlip';
import { FetchSettlementQueueAsync } from '../fetch-settlement-queue-async/FetchSettlementQueueAsync';
import { ValidateSettlementCommand } from './ValidateSettlementCommand';
import { ValidateSettlementResponse } from './ValidateSettlementResponse';

/** TODO(auth): remplacer par l'utilisateur connecté réel — pas d'auth branchée pour l'instant. */
const CURRENT_USER = 'A. Mbarga';

/**
 * Validation croisée : garde-fou contestation ouverte → gateway → transition
 * domaine → cache → modale de succès → toast.
 */
export const ValidateSettlementAsync = createBankAsyncThunk<
  ValidateSettlementResponse,
  ValidateSettlementCommand
>(
  'settlements/validateSettlement',
  async ({ id }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const slip = selectSlipById(getState(), id);

      const openDisputes = disputesSelectors.selectOpenDisputesForAgent(
        getState(),
        slip?.agentId ?? '',
      );
      if (openDisputes.length > 0) {
        throw new Error(
          `${slip?.agentName ?? "L'agent"} a une contestation ouverte — validation bloquée tant qu'elle n'est pas résolue.`,
        );
      }

      const result = await extra.settlementGateway.validate(id);

      dispatch(SettlementsActions.validate({ id }));
      dispatch(settlementValidated({ slipId: id, agentId: slip?.agentId ?? '' }));
      if (slip?.kind === SettlementKind.PartialDeposit) {
        // Un seul event domaine pour ce fait métier : collections décrémente le
        // cash en main de la tournée, dashboard fait de même sur son agrégat.
        dispatch(
          partialDepositValidated({
            roundId: slip.agentId,
            agentId: slip.agentId,
            amount: slip.expectedAmount,
            validatedBy: CURRENT_USER,
          }),
        );
        dispatch(invalidateTags(['Rounds', `Round:${slip.agentId}`]));
      }
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
