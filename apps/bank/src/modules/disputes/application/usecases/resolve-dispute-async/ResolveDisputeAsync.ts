import { getErrorState, invalidateTags, Money } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { disputeResolved } from '../../../domain/events/Events';
import { DisputeDecision, type Dispute } from '../../../domain/entities/Dispute';
import { selectDisputeById } from '../../../domain/selectors/Selectors';
import { DisputesActions } from '../../../domain/slices/DisputesSlice';
import { FetchDisputesAsync } from '../fetch-disputes-async/FetchDisputesAsync';
import { ResolveDisputeCommand } from './ResolveDisputeCommand';
import { ResolveDisputeResponse } from './ResolveDisputeResponse';

/** TODO(auth): remplacer par l'utilisateur connecté réel — pas d'auth branchée pour l'instant. */
const CURRENT_USER = 'A. Mbarga';

const buildSuccessToast = (
  dispute: Dispute,
  inFavorOf: DisputeDecision,
): { title: string; message: string } => {
  if (inFavorOf === DisputeDecision.Client) {
    return {
      title: 'Contestation tranchée en faveur de la cliente',
      message: `Transaction corrigée à ${Money.from(dispute.client.declaredAmount).format()} — écart imputé au reversement de ${dispute.agent.name}.`,
    };
  }
  return {
    title: 'Contestation tranchée en faveur de l’agent',
    message: `Transaction maintenue à ${Money.from(dispute.agent.enteredAmount).format()} — la cliente a été notifiée.`,
  };
};

/** Tranche une contestation : gateway → transition domaine → événement → cache → modale → toast. */
export const ResolveDisputeAsync = createBankAsyncThunk<
  ResolveDisputeResponse,
  ResolveDisputeCommand
>(
  'disputes/resolveDispute',
  async ({ disputeId, inFavorOf, reason }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const dispute = selectDisputeById(getState(), disputeId);
      if (!dispute) {
        throw new Error('Contestation introuvable.');
      }

      await extra.disputeGateway.resolve({
        disputeId,
        inFavorOf,
        reason,
        decidedBy: CURRENT_USER,
      });

      const payload = { id: disputeId, reason, decidedBy: CURRENT_USER };
      if (inFavorOf === DisputeDecision.Client) {
        dispatch(DisputesActions.resolveForClient(payload));
      } else {
        dispatch(DisputesActions.resolveForAgent(payload));
      }
      dispatch(disputeResolved({ disputeId, agentId: dispute.agent.id, decidedInFavorOf: inFavorOf }));
      dispatch(invalidateTags(['Disputes', 'DaySummary']));
      dispatch(FetchDisputesAsync({ force: true }));
      dispatch(closeModal());
      dispatch(pushToast({ variant: 'success', ...buildSuccessToast(dispute, inFavorOf) }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
