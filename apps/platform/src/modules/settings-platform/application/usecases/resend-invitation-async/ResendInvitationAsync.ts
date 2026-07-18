import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { PlatformSettingsActions } from '../../../domain/slices/PlatformSettingsSlice';

/** L'e-mail est déjà masqué côté gateway (`resendInvitation`) — pas de reformatage ici. */
export const ResendInvitationAsync = createPlatformAsyncThunk<void, { collaboratorId: string }>(
  'platformSettings/resendInvitation',
  async ({ collaboratorId }, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const { maskedEmail } = await extra.platformSettingsGateway.resendInvitation(collaboratorId);
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const at = new Date().toISOString();

      dispatch(PlatformSettingsActions.invitationResent({ collaboratorId, by, at }));
      dispatch(invalidateTags(['PlatformSettings']));
      dispatch(pushToast({ variant: 'success', title: 'Invitation renvoyée', message: `Invitation renvoyée à ${maskedEmail}.` }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
