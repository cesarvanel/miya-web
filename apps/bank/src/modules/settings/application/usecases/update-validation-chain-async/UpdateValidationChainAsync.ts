import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { selectValidationChainByAgency } from '../../../domain/selectors/Selectors';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpdateValidationChainCommand } from './UpdateValidationChainCommand';

/** Décrit le changement structurel (ajout/retrait/réordonnancement) pour le Journal — calculé ici, jamais côté vue. */
const describeChange = (
  oldValidators: { id: string; name: string }[] | undefined,
  newValidators: { id: string; name: string }[],
): string => {
  const oldIds = oldValidators?.map((v) => v.id) ?? [];
  const newIds = newValidators.map((v) => v.id);

  const added = newValidators.find((v) => !oldIds.includes(v.id));
  if (added) {
    const position = newIds.indexOf(added.id) + 1;
    return `Suppléant ajouté : ${added.name} en position ${position}`;
  }
  const removed = oldValidators?.find((v) => !newIds.includes(v.id));
  if (removed) {
    return `Validateur retiré : ${removed.name}`;
  }
  if (oldIds.join(',') !== newIds.join(',')) {
    return 'Ordre des validateurs modifié';
  }
  return 'Chaîne de validation mise à jour';
};

/**
 * Chaîne de validation (maquette 9h) : garde-fou — au moins un validateur
 * actif par agence — → gateway → transition (le domaine trace le libellé du
 * changement, calculé ici en application layer) → cache → toast.
 */
export const UpdateValidationChainAsync = createBankAsyncThunk<void, UpdateValidationChainCommand>(
  'settings/updateValidationChain',
  async ({ agencyId, agencyName, validators }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      if (validators.length === 0) {
        throw new Error('Chaque agence doit avoir au moins un validateur actif.');
      }

      const current = selectValidationChainByAgency(getState(), agencyId);
      const description = describeChange(current?.validators, validators);

      await extra.settingsGateway.updateValidationChain(agencyId, validators);

      dispatch(
        SettingsActions.validationChainUpdated({
          by: 'D. Ndione',
          at: new Date().toISOString(),
          agencyId,
          agencyName,
          validators,
          description,
        }),
      );
      dispatch(invalidateTags(['Settings']));
      dispatch(pushToast({ variant: 'success', title: 'Chaîne de validation enregistrée', message: description }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
