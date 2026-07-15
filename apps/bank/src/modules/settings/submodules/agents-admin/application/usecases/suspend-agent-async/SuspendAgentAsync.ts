import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { selectDayRecordsByAgent } from '../../../domain/selectors/Selectors';
import { AgentsActions } from '../../../domain/slices/AgentsSlice';
import { SuspendAgentCommand } from './SuspendAgentCommand';
import { SuspendAgentResponse } from './SuspendAgentResponse';

/**
 * Suspension (destructive, motif obligatoire) : refusée si le reversement du
 * jour de l'agent est en attente (garde-fou redondant avec le reducer, pour
 * un message d'erreur explicite côté vue) → gateway → transition → cache → toast.
 */
export const SuspendAgentAsync = createBankAsyncThunk<SuspendAgentResponse, SuspendAgentCommand>(
  'agents/suspendAgent',
  async ({ id, reason }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const latestRecord = selectDayRecordsByAgent(getState(), id)[0];
      if (latestRecord?.settlementStatus === 'Pending') {
        throw new Error('Impossible de suspendre : le reversement du jour est encore en attente.');
      }

      await extra.agentGateway.suspend(id, reason);

      dispatch(AgentsActions.suspended({ id }));
      dispatch(invalidateTags(['Agents', `Agent:${id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Agent suspendu',
          message: 'Le compte est suspendu jusqu’à réactivation.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
