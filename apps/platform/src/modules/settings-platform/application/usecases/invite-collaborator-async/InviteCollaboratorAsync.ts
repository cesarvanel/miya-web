import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { collaboratorAdded } from '../../../domain/events';
import { PlatformSettingsActions } from '../../../domain/slices/PlatformSettingsSlice';
import { InviteCollaboratorCommand } from './InviteCollaboratorCommand';

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) {
    return `${email.slice(0, 2)}•••`;
  }
  const dotIndex = local.indexOf('.');
  const kept = dotIndex >= 0 ? local.slice(0, dotIndex + 1) : local.slice(0, 1);
  return `${kept}•••@${domain}`;
};

/** Invite un collaborateur console éditeur — émet aussi l'event `collaboratorAdded` consommé par le journal d'audit du module activity. */
export const InviteCollaboratorAsync = createPlatformAsyncThunk<void, InviteCollaboratorCommand>(
  'platformSettings/inviteCollaborator',
  async (command, { extra, dispatch, getState, rejectWithValue }) => {
    try {
      const collaborator = await extra.platformSettingsGateway.inviteCollaborator(command);
      const at = new Date().toISOString();
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = authSelectors.selectCurrentUser(getState())?.id ?? '';

      dispatch(PlatformSettingsActions.collaboratorInvited({ collaborator, by, at }));
      dispatch(collaboratorAdded({ collaboratorId: collaborator.id, collaboratorName: collaborator.fullName, role: collaborator.role, by, byId, at }));
      dispatch(invalidateTags(['PlatformSettings']));
      dispatch(
        pushToast({
          variant: 'success',
          title: 'Invitation envoyée',
          message: `Invitation envoyée à ${maskEmail(collaborator.email)}.`,
        }),
      );
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
