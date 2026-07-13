import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { AgentsActions } from '../../../domain/slices/AgentsSlice';
import { ReactivateAgentCommand } from './ReactivateAgentCommand';
import { ReactivateAgentResponse } from './ReactivateAgentResponse';

/** Réactivation d'un agent suspendu : gateway → transition → cache → toast. */
export const ReactivateAgentAsync = createBankAsyncThunk<ReactivateAgentResponse, ReactivateAgentCommand>(
  'agents/reactivateAgent',
  async ({ id }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.agentGateway.reactivate(id);

      dispatch(AgentsActions.reactivated({ id }));
      dispatch(invalidateTags(['Agents', `Agent:${id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Agent réactivé',
          message: 'Le compte peut de nouveau collecter.',
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
