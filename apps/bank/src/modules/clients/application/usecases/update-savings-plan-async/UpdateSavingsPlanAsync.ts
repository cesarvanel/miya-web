import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { SAVINGS_PLAN_FLOOR_AMOUNT } from '../../../domain/entities/SavingsPlan';
import { selectClientById } from '../../../domain/selectors/Selectors';
import { ClientsActions } from '../../../domain/slices/ClientsSlice';
import { UpdateSavingsPlanCommand } from './UpdateSavingsPlanCommand';
import { UpdateSavingsPlanResponse } from './UpdateSavingsPlanResponse';

/**
 * Modifie le plan d'épargne (montant + jours) : garde-fous plancher/jours non
 * vides → gateway → transition → cache → toast. Effectif dès le prochain jour
 * de collecte — l'engagement en cours (dates) n'est pas rétroactif.
 */
export const UpdateSavingsPlanAsync = createBankAsyncThunk<UpdateSavingsPlanResponse, UpdateSavingsPlanCommand>(
  'clients/updateSavingsPlan',
  async ({ id, amountPerCollectionDay, collectionDays }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const client = selectClientById(getState(), id);
      if (!client) {
        throw new Error('Client introuvable.');
      }
      if (collectionDays.length === 0) {
        throw new Error('Sélectionnez au moins un jour de collecte.');
      }
      if (amountPerCollectionDay < SAVINGS_PLAN_FLOOR_AMOUNT) {
        throw new Error(`Le montant doit être supérieur ou égal au plancher (${SAVINGS_PLAN_FLOOR_AMOUNT} FCFA).`);
      }

      await extra.clientGateway.updateSavingsPlan(id, amountPerCollectionDay, collectionDays);

      dispatch(ClientsActions.savingsPlanChanged({ id, amountPerCollectionDay, collectionDays }));
      dispatch(invalidateTags(['Clients', `Client:${id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Plan d’épargne modifié',
          message: 'Effectif dès le prochain jour de collecte.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
