import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { selectClientById } from '../../../domain/selectors/Selectors';
import { ClientsActions } from '../../../domain/slices/ClientsSlice';
import { UpdateUsualAmountCommand } from './UpdateUsualAmountCommand';
import { UpdateUsualAmountResponse } from './UpdateUsualAmountResponse';

/** Modifie le montant habituel : garde-fou plancher → gateway → transition → cache → toast. */
export const UpdateUsualAmountAsync = createBankAsyncThunk<
  UpdateUsualAmountResponse,
  UpdateUsualAmountCommand
>(
  'clients/updateUsualAmount',
  async ({ id, amount }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const client = selectClientById(getState(), id);
      if (!client) {
        throw new Error('Client introuvable.');
      }
      if (amount < client.plan.floorAmount) {
        throw new Error(`Le montant doit être supérieur ou égal au plancher (${client.plan.floorAmount} FCFA).`);
      }

      await extra.clientGateway.updateUsualAmount(id, amount);

      dispatch(ClientsActions.usualAmountChanged({ id, amount }));
      dispatch(invalidateTags(['Clients', `Client:${id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Montant habituel modifié',
          message: 'Effectif dès la prochaine cotisation.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
