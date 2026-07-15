import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { AgenciesActions } from '../../../domain/slices/AgenciesSlice';
import { AssignZoneAgentCommand } from './AssignZoneAgentCommand';

/** Affectation (ou réaffectation) d'un agent collecteur à une zone. */
export const AssignZoneAgentAsync = createBankAsyncThunk<void, AssignZoneAgentCommand>(
  'agencies/assignZoneAgent',
  async ({ zoneId, agentId, agentName }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.agenciesGateway.assignZoneAgent(zoneId, agentId, agentName);

      dispatch(AgenciesActions.zoneAgentAssigned({ zoneId, agentId, agentName }));
      dispatch(invalidateTags(['Agencies']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Agent affecté',
          message: agentName,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
