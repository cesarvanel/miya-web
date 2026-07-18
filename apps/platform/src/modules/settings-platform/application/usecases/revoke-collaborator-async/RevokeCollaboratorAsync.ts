import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { isLastActiveOwner } from '../../../domain/entities/Collaborator';
import { selectCollaboratorsList } from '../../../domain/selectors/Selectors';
import { PlatformSettingsActions } from '../../../domain/slices/PlatformSettingsSlice';

/** Révocation destructive — ses sessions sont fermées côté gateway. Mêmes garde-fous que le changement de rôle, revérifiés avant la gateway. */
export const RevokeCollaboratorAsync = createPlatformAsyncThunk<void, { collaboratorId: string; reason: string }>(
  'platformSettings/revokeCollaborator',
  async ({ collaboratorId, reason }, { extra, dispatch, getState, rejectWithValue }) => {
    const currentUserId = authSelectors.selectCurrentUser(getState())?.id;
    if (currentUserId === collaboratorId) {
      const error = new Error('Vous ne pouvez pas révoquer votre propre accès.');
      dispatch(pushToast({ variant: 'error', title: 'Action refusée', message: error.message }));
      return rejectWithValue(getErrorState(error));
    }
    if (isLastActiveOwner(selectCollaboratorsList(getState()), collaboratorId)) {
      const error = new Error('Impossible de révoquer le dernier compte Complet actif — la plateforme doit toujours en garder un.');
      dispatch(pushToast({ variant: 'error', title: 'Action refusée', message: error.message }));
      return rejectWithValue(getErrorState(error));
    }

    try {
      await extra.platformSettingsGateway.revokeCollaborator(collaboratorId, reason);
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = currentUserId ?? '';
      const at = new Date().toISOString();

      dispatch(PlatformSettingsActions.collaboratorRevoked({ collaboratorId, reason, by, byId, at }));
      dispatch(invalidateTags(['PlatformSettings']));
      dispatch(pushToast({ variant: 'success', title: 'Collaborateur révoqué', message: 'Ses sessions ont été fermées.' }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
