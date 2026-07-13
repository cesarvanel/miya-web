import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { selectWithdrawalById } from '../../../domain/selectors/Selectors';
import { WithdrawalsActions } from '../../../domain/slices/WithdrawalsSlice';
import { RejectWithdrawalCommand } from './RejectWithdrawalCommand';
import { RejectWithdrawalResponse } from './RejectWithdrawalResponse';

/** TODO(auth): remplacer par l'utilisateur connecté réel — pas d'auth branchée pour l'instant. */
const CURRENT_USER = 'A. Mbarga';

/** Rejet (destructif, motif obligatoire) : gateway → transition → cache → toast. */
export const RejectWithdrawalAsync = createBankAsyncThunk<RejectWithdrawalResponse, RejectWithdrawalCommand>(
  'withdrawals/rejectWithdrawal',
  async ({ id, reason }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const withdrawal = selectWithdrawalById(getState(), id);
      if (!withdrawal) {
        throw new Error('Demande introuvable.');
      }

      await extra.withdrawalGateway.reject(id, reason);

      dispatch(
        WithdrawalsActions.rejected({ id, by: CURRENT_USER, at: new Date().toISOString(), reason }),
      );
      dispatch(invalidateTags(['Withdrawals']));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Demande refusée',
          message: `${withdrawal.client.name} sera notifiée du refus.`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
