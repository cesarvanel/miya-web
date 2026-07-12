import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { ClientStatus } from '../../../domain/entities/Client';
import { ClientsActions } from '../../../domain/slices/ClientsSlice';
import { DeactivateClientCommand } from './DeactivateClientCommand';
import { DeactivateClientResponse } from './DeactivateClientResponse';

/** Désactivation (destructive, motif obligatoire) : gateway → transition → cache → toast. */
export const DeactivateClientAsync = createBankAsyncThunk<
  DeactivateClientResponse,
  DeactivateClientCommand
>(
  'clients/deactivateClient',
  async ({ id, reason }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.clientGateway.deactivate(id, reason);

      dispatch(ClientsActions.statusChanged({ id, status: ClientStatus.Inactive }));
      dispatch(invalidateTags(['Clients', `Client:${id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Client désactivé',
          message: 'Le compte ne pourra plus cotiser tant qu’il n’est pas réactivé.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
