import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { selectWithdrawalById } from '../../../domain/selectors/Selectors';
import { withdrawalApproved } from '../../../domain/events/Events';
import { ApproveWithdrawalCommand } from './ApproveWithdrawalCommand';
import { ApproveWithdrawalResponse } from './ApproveWithdrawalResponse';

/**
 * Validation d'une demande : refusée si le montant dépasse le solde disponible
 * (garde-fou redondant avec le reducer, pour un message explicite côté vue)
 * → gateway → événement domaine → cache → toast.
 */
export const ApproveWithdrawalAsync = createBankAsyncThunk<ApproveWithdrawalResponse, ApproveWithdrawalCommand>(
  'withdrawals/approveWithdrawal',
  async ({ id }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const withdrawal = selectWithdrawalById(getState(), id);
      if (!withdrawal) {
        throw new Error('Demande introuvable.');
      }
      if (withdrawal.requestedAmount > withdrawal.availableBalance) {
        throw new Error('Le montant demandé dépasse le solde disponible du client.');
      }

      await extra.withdrawalGateway.approve(id);

      const at = new Date().toISOString();
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      dispatch(withdrawalApproved({ withdrawalId: id, clientId: withdrawal.client.id, by, at }));
      dispatch(invalidateTags(['Withdrawals']));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Demande validée — à décaisser',
          message: `${withdrawal.client.name} · ${withdrawal.requestedAmount.toLocaleString('fr-FR')} FCFA`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
