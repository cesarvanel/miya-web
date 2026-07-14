import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { SettingsActions } from '../../../domain/slices/SettingsSlice';
import { UpdateCustodyFeesCommand } from './UpdateCustodyFeesCommand';

/** Frais de garde (maquette 9g) : gateway → transition → cache → toast. */
export const UpdateCustodyFeesAsync = createBankAsyncThunk<void, UpdateCustodyFeesCommand>(
  'settings/updateCustodyFees',
  async (custodyFees, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.settingsGateway.updateCustodyFees(custodyFees);

      dispatch(SettingsActions.custodyFeesUpdated({ by: 'D. Ndione', at: new Date().toISOString(), custodyFees }));
      dispatch(invalidateTags(['Settings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Frais de garde mis à jour',
          message: 'Les clients sont informés du mode de calcul à l’adhésion.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
