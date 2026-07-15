import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { AgenciesActions } from '../../../domain/slices/AgenciesSlice';
import { CreateZoneCommand } from './CreateZoneCommand';
import { CreateZoneResponse } from './CreateZoneResponse';

/** Création d'une zone de collecte : gateway → transition → cache → toast. */
export const CreateZoneAsync = createBankAsyncThunk<CreateZoneResponse, CreateZoneCommand>(
  'agencies/createZone',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      if (!command.name.trim()) {
        throw new Error('Le nom de la zone est obligatoire.');
      }

      const result = await extra.agenciesGateway.createZone(command);

      dispatch(AgenciesActions.zoneCreated(result.zone));
      dispatch(invalidateTags(['Agencies']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Zone créée',
          message: result.zone.name,
        }),
      );

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
