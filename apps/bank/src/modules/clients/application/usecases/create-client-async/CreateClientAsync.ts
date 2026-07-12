import { getErrorState, invalidateTags, PhoneNumber } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { ClientsActions } from '../../../domain/slices/ClientsSlice';
import { CreateClientCommand } from './CreateClientCommand';
import { CreateClientResponse } from './CreateClientResponse';

/**
 * Création d'une cliente : validations (montant ≥ plancher, téléphone
 * camerounais valide) → gateway → transition domaine → cache → toast.
 * La navigation vers la fiche se fait côté vue, sur le `fulfilled`.
 */
export const CreateClientAsync = createBankAsyncThunk<
  CreateClientResponse,
  CreateClientCommand
>(
  'clients/createClient',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      if (command.usualAmount < command.plan.floorAmount) {
        throw new Error(
          `Le montant choisi doit être supérieur ou égal au plancher du plan (${command.plan.floorAmount} FCFA).`,
        );
      }
      try {
        PhoneNumber.from(command.identity.phone);
      } catch {
        throw new Error('Numéro de téléphone camerounais invalide.');
      }

      const result = await extra.clientGateway.create(command);

      dispatch(ClientsActions.clientCreated(result.client));
      dispatch(invalidateTags(['Clients']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Client créé — carte QR prête à imprimer',
          message: `${result.client.fullName} peut désormais cotiser auprès de ${result.client.assignedAgent.name}.`,
        }),
      );

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
