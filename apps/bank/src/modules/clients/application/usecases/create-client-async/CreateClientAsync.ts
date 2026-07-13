import { getErrorState, invalidateTags, PhoneNumber } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SAVINGS_PLAN_FLOOR_AMOUNT } from '../../../domain/entities/SavingsPlan';
import { ClientsActions } from '../../../domain/slices/ClientsSlice';
import { CreateClientCommand } from './CreateClientCommand';
import { CreateClientResponse } from './CreateClientResponse';

/**
 * Création d'une cliente : validations (jours de collecte cochés, échéance
 * postérieure au départ, montant ≥ plancher, téléphone camerounais valide)
 * → gateway (calcule `computed` via le service pur) → transition domaine →
 * cache → toast. La navigation vers la fiche se fait côté vue, sur le `fulfilled`.
 */
export const CreateClientAsync = createBankAsyncThunk<
  CreateClientResponse,
  CreateClientCommand
>(
  'clients/createClient',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      const { savingsPlan } = command;
      if (savingsPlan.collectionDays.length === 0) {
        throw new Error('Sélectionnez au moins un jour de collecte.');
      }
      if (savingsPlan.endDate <= savingsPlan.startDate) {
        throw new Error("La date de fin d'engagement doit être postérieure à la date de départ.");
      }
      if (savingsPlan.amountPerCollectionDay < SAVINGS_PLAN_FLOOR_AMOUNT) {
        throw new Error(
          `Le montant choisi doit être supérieur ou égal au plancher (${SAVINGS_PLAN_FLOOR_AMOUNT} FCFA).`,
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
