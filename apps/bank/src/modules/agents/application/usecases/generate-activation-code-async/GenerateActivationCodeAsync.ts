import { getErrorState } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { AgentsActions } from '../../../domain/slices/AgentsSlice';
import { GenerateActivationCodeCommand } from './GenerateActivationCodeCommand';
import { GenerateActivationCodeResponse } from './GenerateActivationCodeResponse';

/**
 * Génère un code d'activation à usage unique — PAS de cache : le code n'a de
 * sens qu'à l'instant de sa génération et s'affiche dans une modale (jamais
 * persisté en Redux au-delà de l'horodatage d'audit `lastActivationCodeGeneratedAt`).
 */
export const GenerateActivationCodeAsync = createBankAsyncThunk<
  GenerateActivationCodeResponse,
  GenerateActivationCodeCommand
>(
  'agents/generateActivationCode',
  async ({ agentId }, { extra, dispatch, rejectWithValue }) => {
    try {
      const result = await extra.agentGateway.generateActivationCode(agentId);

      dispatch(AgentsActions.activationCodeGenerated({ id: agentId, generatedAt: new Date().toISOString() }));

      return result;
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
