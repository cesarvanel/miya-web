import { createSelector } from '@reduxjs/toolkit';
import { ChangeLogAdapter } from '@miya/kernel';
import type { PlatformRootState } from '@/config/store';
import { collaboratorsAdapter } from '../entities/Collaborator';
import { templatesAdapter, type NotificationTemplate } from '../entities/NotificationTemplate';

const collaboratorsSelectors = collaboratorsAdapter.getSelectors((state: PlatformRootState) => state.platformSettings.collaborators);
const templatesSelectors = templatesAdapter.getSelectors((state: PlatformRootState) => state.platformSettings.templates);
const changeLogSelectors = ChangeLogAdapter.getSelectors((state: PlatformRootState) => state.platformSettings.changeLog);

export const selectIdentity = (state: PlatformRootState) => state.platformSettings.identity;

export const selectCollaboratorsList = collaboratorsSelectors.selectAll;

export const selectCollaboratorById = (state: PlatformRootState, collaboratorId: string) =>
  collaboratorsSelectors.selectById(state, collaboratorId);

export const selectTemplatesList = templatesSelectors.selectAll;

export const selectTemplateById = (state: PlatformRootState, templateId: string): NotificationTemplate | undefined =>
  templatesSelectors.selectById(state, templateId);

export const selectChangeLog = changeLogSelectors.selectAll;

export const selectChangeLogBySection = createSelector(
  [selectChangeLog, (_state: PlatformRootState, section?: string) => section],
  (entries, section) => (section ? entries.filter((entry) => entry.section === section) : entries),
);

export const PlatformSettingsSelectors = {
  selectIdentity,
  selectCollaboratorsList,
  selectCollaboratorById,
  selectTemplatesList,
  selectTemplateById,
  selectChangeLog,
  selectChangeLogBySection,
};
