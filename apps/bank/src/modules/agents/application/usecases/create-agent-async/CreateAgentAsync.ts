import { getErrorState, invalidateTags, PhoneNumber } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { AgentRole } from '../../../domain/entities/Agent';
import { AgentsActions } from '../../../domain/slices/AgentsSlice';
import { CreateAgentCommand } from './CreateAgentCommand';
import { CreateAgentResponse } from './CreateAgentResponse';

/**
 * Création d'un agent ou d'un responsable : validations (téléphone camerounais,
 * responsable obligatoire pour un collecteur) → gateway → transition → cache → toast.
 * La navigation vers la fiche se fait côté vue, sur le `fulfilled`.
 */
export const CreateAgentAsync = createBankAsyncThunk<CreateAgentResponse, CreateAgentCommand>(
  'agents/createAgent',
  async (command, { extra, dispatch, rejectWithValue }) => {
    try {
      try {
        PhoneNumber.from(command.identity.phone);
      } catch {
        throw new Error('Numéro de téléphone camerounais invalide.');
      }
      if (command.role === AgentRole.Collector && !command.supervisorId) {
        throw new Error('Un responsable est obligatoire pour un agent collecteur.');
      }

      const result = await extra.agentGateway.create(command);

      dispatch(AgentsActions.agentCreated(result.agent));
      dispatch(invalidateTags(['Agents']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Agent créé — générez son code d’activation',
          message: `${result.agent.fullName} pourra collecter dès qu'un appareil sera lié.`,
        }),
      );

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
