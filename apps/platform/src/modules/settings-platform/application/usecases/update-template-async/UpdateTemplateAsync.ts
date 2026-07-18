import { getErrorState, invalidateTags } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { createPlatformAsyncThunk } from '@/config/thunks/CreatePlatformAsyncThunks';
import { pushToast } from '@/shared/toasts';
import { validateTemplateBody } from '../../../domain/entities/NotificationTemplate';
import { selectTemplateById } from '../../../domain/selectors/Selectors';
import { PlatformSettingsActions } from '../../../domain/slices/PlatformSettingsSlice';
import { UpdateTemplateCommand } from './UpdateTemplateCommand';

/** Revalide les variables obligatoires avant tout appel gateway — erreur claire, pas un no-op silencieux. */
export const UpdateTemplateAsync = createPlatformAsyncThunk<void, UpdateTemplateCommand>(
  'platformSettings/updateTemplate',
  async ({ templateId, subject, body }, { extra, dispatch, getState, rejectWithValue }) => {
    const template = selectTemplateById(getState(), templateId);
    if (!template) {
      return rejectWithValue(getErrorState(new Error('Modèle introuvable.')));
    }
    const { valid, missing } = validateTemplateBody(template.kind, body);
    if (!valid) {
      const error = new Error(`Variable${missing.length > 1 ? 's' : ''} obligatoire${missing.length > 1 ? 's' : ''} manquante${missing.length > 1 ? 's' : ''} : ${missing.join(', ')}.`);
      dispatch(pushToast({ variant: 'error', title: 'Modèle non enregistré', message: error.message }));
      return rejectWithValue(getErrorState(error));
    }

    try {
      await extra.platformSettingsGateway.updateTemplate(templateId, { subject, body });
      const by = authSelectors.selectCurrentUserDisplayName(getState());
      const at = new Date().toISOString();

      dispatch(PlatformSettingsActions.templateUpdated({ templateId, subject, body, by, at }));
      dispatch(invalidateTags(['PlatformSettings']));
      dispatch(pushToast({ variant: 'success', title: 'Modèle mis à jour', message: 'Le nouveau message sera utilisé dès le prochain envoi.' }));
    } catch (error) {
      return rejectWithValue(getErrorState(error));
    }
  },
);
