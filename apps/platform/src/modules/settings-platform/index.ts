import { PlatformSettingsSelectors } from './domain/selectors/Selectors';
import { platformSettingsSlice } from './domain/slices/PlatformSettingsSlice';

// Types de domaine
export type { PlatformIdentity, PlatformIdentityContacts } from './domain/entities/PlatformIdentity';
export { CollaboratorStatus, isLastActiveOwner } from './domain/entities/Collaborator';
export type { Collaborator } from './domain/entities/Collaborator';
export {
  AVAILABLE_TEMPLATE_VARIABLES,
  NotificationTemplateKind,
  REQUIRED_TEMPLATE_VARIABLES,
  validateTemplateBody,
} from './domain/entities/NotificationTemplate';
export type { NotificationTemplate, TemplateValidationResult } from './domain/entities/NotificationTemplate';

// Events (le module activity s'y abonne via cet index)
export { collaboratorAdded } from './domain/events';
export type { CollaboratorAddedEvent } from './domain/events';

// Reducer (branché dans root-reducer)
export const platformSettingsReducer = platformSettingsSlice.reducer;

// Selectors — groupés, comme prescrit par CLAUDE.md
export const platformSettingsSelectors = {
  ...PlatformSettingsSelectors,
};

// Use cases
export { FetchPlatformSettingsAsync } from './application/usecases/fetch-platform-settings-async/FetchPlatformSettingsAsync';
export { UpdateIdentityAsync } from './application/usecases/update-identity-async/UpdateIdentityAsync';
export { InviteCollaboratorAsync } from './application/usecases/invite-collaborator-async/InviteCollaboratorAsync';
export type { InviteCollaboratorCommand } from './application/usecases/invite-collaborator-async/InviteCollaboratorCommand';
export { ChangeCollaboratorRoleAsync } from './application/usecases/change-collaborator-role-async/ChangeCollaboratorRoleAsync';
export type { ChangeCollaboratorRoleCommand } from './application/usecases/change-collaborator-role-async/ChangeCollaboratorRoleCommand';
export { RevokeCollaboratorAsync } from './application/usecases/revoke-collaborator-async/RevokeCollaboratorAsync';
export { ResendInvitationAsync } from './application/usecases/resend-invitation-async/ResendInvitationAsync';
export { UpdateTemplateAsync } from './application/usecases/update-template-async/UpdateTemplateAsync';
export type { UpdateTemplateCommand } from './application/usecases/update-template-async/UpdateTemplateCommand';

// Ports (types utilisés par la composition root)
export type { PlatformSettingsDependencies } from './application/ports/PlatformSettingsDependencies';
export type { FetchAllResponse, PlatformSettingsGateway } from './application/ports/PlatformSettingsGateway';

// Infrastructure (instanciée par la composition root)
export { FakePlatformSettingsGateway } from './infrastructure/gateways/FakePlatformSettingsGateway';

// Vues (routées par config/router.tsx)
export { PlatformSettingsPage } from './infrastructure/views/index/PlatformSettingsPage';
export { ChangeLogDrawerPage } from './infrastructure/views/changelog/ChangeLogDrawerPage';

// Modales (montées globalement dans le layout)
export { EditPlatformIdentityModal } from './infrastructure/views/modal/EditPlatformIdentityModal';
export { InviteCollaboratorModal } from './infrastructure/views/modal/InviteCollaboratorModal';
export { ChangeCollaboratorRoleModal } from './infrastructure/views/modal/ChangeCollaboratorRoleModal';
export { RevokeCollaboratorModal } from './infrastructure/views/modal/RevokeCollaboratorModal';
export { ConfirmResendInvitationModal } from './infrastructure/views/modal/ConfirmResendInvitationModal';
export { TemplateEditorModal } from './infrastructure/views/modal/TemplateEditorModal';
