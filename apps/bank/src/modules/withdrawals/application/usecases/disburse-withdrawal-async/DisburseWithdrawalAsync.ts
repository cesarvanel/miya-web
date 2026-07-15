import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { WithdrawalStatus } from '../../../domain/entities/Withdrawal';
import { selectWithdrawalById } from '../../../domain/selectors/Selectors';
import { withdrawalDisbursed } from '../../../domain/events/Events';
import { DisburseWithdrawalCommand } from './DisburseWithdrawalCommand';
import { DisburseWithdrawalResponse } from './DisburseWithdrawalResponse';

/**
 * Décaissement (étape critique) : refusé si la demande n'est pas Approved
 * (garde-fou redondant avec le reducer) → gateway → événement domaine (débite
 * le solde du client via son propre index public) → cache (Withdrawals +
 * Clients, le client concerné) → toast.
 */
export const DisburseWithdrawalAsync = createBankAsyncThunk<
  DisburseWithdrawalResponse,
  DisburseWithdrawalCommand
>(
  'withdrawals/disburseWithdrawal',
  async (command, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const withdrawal = selectWithdrawalById(getState(), command.withdrawalId);
      if (!withdrawal) {
        throw new Error('Demande introuvable.');
      }
      if (withdrawal.status !== WithdrawalStatus.Approved) {
        throw new Error('Cette demande doit être validée avant le décaissement.');
      }

      await extra.withdrawalGateway.disburse(command);

      const at = new Date().toISOString();
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      dispatch(
        withdrawalDisbursed({
          withdrawalId: command.withdrawalId,
          clientId: withdrawal.client.id,
          amount: withdrawal.requestedAmount,
          by,
          at,
          method: command.method,
          agentId: command.agentId,
        }),
      );
      dispatch(invalidateTags(['Withdrawals', 'Clients', `Client:${withdrawal.client.id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Décaissement confirmé',
          message: `${withdrawal.requestedAmount.toLocaleString('fr-FR')} FCFA remis à ${withdrawal.client.name}`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
