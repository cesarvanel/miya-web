import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors, PlatformUserRole } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { isLastActiveOwner } from '../../../domain/entities/Collaborator';
import { selectCollaboratorsList } from '../../../domain/selectors/Selectors';
import { PlatformSettingsActions } from '../../../domain/slices/PlatformSettingsSlice';
import { ChangeCollaboratorRoleCommand } from './ChangeCollaboratorRoleCommand';

/**
 * Les garde-fous du slice (dernier Owner actif, auto-modification) sont
 * revérifiés ICI, avant tout appel gateway, pour remonter une erreur claire
 * immédiatement plutôt qu'un no-op silencieux après un aller-retour réseau.
 */
export const ChangeCollaboratorRoleAsync = createPlatformAsyncThunk<void, ChangeCollaboratorRoleCommand>(
  'platformSettings/changeCollaboratorRole',
  async ({ collaboratorId, newRole }, { extra, dispatch, getState, rejectWithValue }) => {
    const currentUserId = authSelectors.selectCurrentUser(getState())?.id;
    if (currentUserId === collaboratorId) {
      const error = new Error('Vous ne pouvez pas modifier votre propre rôle.');
      dispatch(pushToast({ variant: 'error', title: 'Action refusée', message: error.message }));
      return rejectWithValue(getErrorState(error));
    }
    if (newRole === PlatformUserRole.ReadOnly && isLastActiveOwner(selectCollaboratorsList(getState()), collaboratorId)) {
      const error = new Error('Impossible de rétrograder le dernier compte Complet actif — la plateforme doit toujours en garder un.');
      dispatch(pushToast({ variant: 'error', title: 'Action refusée', message: error.message }));
      return rejectWithValue(getErrorState(error));
    }

    try {
      await extra.platformSettingsGateway.changeCollaboratorRole(collaboratorId, newRole);
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const byId = currentUserId ?? '';
      const at = new Date().toISOString();

      dispatch(PlatformSettingsActions.collaboratorRoleChanged({ collaboratorId, newRole, by, byId, at }));
      dispatch(invalidateTags(['PlatformSettings']));
      dispatch(pushToast({ variant: 'success', title: 'Rôle mis à jour', message: 'Le nouveau rôle est effectif immédiatement.' }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
