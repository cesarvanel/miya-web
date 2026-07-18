import { useEffect, useState } from 'react';
import { useRequestStatus } from '@miya/kernel';
import { authSelectors } from '@/modules/auth';
import { usePlatformDispatch, usePlatformSelector } from '@/config/root-hook';
import { useCanWrite } from '@/shared/guards/useCanWrite';
import { openModal } from '@/shared/modals';
import { FetchPlatformSettingsAsync } from '../../../application/usecases/fetch-platform-settings-async/FetchPlatformSettingsAsync';
import { selectCollaboratorsList, selectIdentity, selectTemplatesList } from '../../../domain/selectors/Selectors';

export type SettingsSectionId = 'identity' | 'collaborators' | 'notifications';

export const SETTINGS_SECTIONS: { id: SettingsSectionId; label: string }[] = [
  { id: 'identity', label: 'Identité Miya' },
  { id: 'collaborators', label: 'Comptes super admin' },
  { id: 'notifications', label: 'Notifications' },
];

export const useSettingsPage = () => {
  const dispatch = usePlatformDispatch();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('identity');

  useEffect(() => {
    dispatch(FetchPlatformSettingsAsync());
  }, [dispatch]);

  const { isPending } = useRequestStatus(FetchPlatformSettingsAsync);
  const identity = usePlatformSelector(selectIdentity);
  const collaborators = usePlatformSelector(selectCollaboratorsList);
  const templates = usePlatformSelector(selectTemplatesList);
  const currentUserId = usePlatformSelector(authSelectors.selectCurrentUser)?.id ?? '';
  const canWrite = useCanWrite();

  const goToSection = (id: SettingsSectionId): void => {
    setActiveSection(id);
    document.getElementById(`platform-settings-section-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const openEditIdentity = (): void => {
    dispatch(openModal({ type: 'editPlatformIdentity', props: undefined }));
  };
  const openInviteCollaborator = (): void => {
    dispatch(openModal({ type: 'inviteCollaborator', props: undefined }));
  };
  const openChangeCollaboratorRole = (collaboratorId: string): void => {
    dispatch(openModal({ type: 'changeCollaboratorRole', props: { collaboratorId } }));
  };
  const openResendCollaboratorInvitation = (collaboratorId: string): void => {
    dispatch(openModal({ type: 'confirmResendCollaboratorInvitation', props: { collaboratorId } }));
  };
  const openRevokeCollaborator = (collaboratorId: string): void => {
    dispatch(openModal({ type: 'revokeCollaborator', props: { collaboratorId } }));
  };
  const openEditTemplate = (templateId: string): void => {
    dispatch(openModal({ type: 'editTemplate', props: { templateId } }));
  };

  return {
    identity,
    collaborators,
    templates,
    isPending,
    activeSection,
    goToSection,
    currentUserId,
    canWrite,
    openEditIdentity,
    openInviteCollaborator,
    openChangeCollaboratorRole,
    openResendCollaboratorInvitation,
    openRevokeCollaborator,
    openEditTemplate,
  };
};
