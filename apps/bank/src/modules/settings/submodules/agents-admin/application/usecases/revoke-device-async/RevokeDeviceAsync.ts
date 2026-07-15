import { getErrorState, invalidateTags } from '@miya/kernel';
import { createBankAsyncThunk } from '@/config/stores/thunks/CreateBankAsyncThunks';
import { closeModal } from '@/shared/modals';
import { pushToast } from '@/shared/toasts';
import { AgentsActions } from '../../../domain/slices/AgentsSlice';
import { RevokeDeviceCommand } from './RevokeDeviceCommand';
import { RevokeDeviceResponse } from './RevokeDeviceResponse';

/** Révocation (destructive, motif obligatoire) : gateway → transition → cache → toast d'alerte. */
export const RevokeDeviceAsync = createBankAsyncThunk<RevokeDeviceResponse, RevokeDeviceCommand>(
  'agents/revokeDevice',
  async ({ id, reason }, { extra, dispatch, rejectWithValue }) => {
    try {
      await extra.agentGateway.revokeDevice(id, reason);

      dispatch(AgentsActions.deviceRevoked({ id }));
      dispatch(invalidateTags(['Agents', `Agent:${id}`]));
      dispatch(closeModal());
      dispatch(
        pushToast({
          variant: 'warning',
          title: 'Appareil révoqué',
          message: "L'agent ne peut plus collecter tant qu'un nouvel appareil n'est pas lié.",
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
