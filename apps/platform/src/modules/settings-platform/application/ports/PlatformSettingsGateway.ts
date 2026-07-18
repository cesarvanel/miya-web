import type { ChangeLogEntry } from '@miya/kernel';
import type { PlatformUserRole } from '@/modules/auth';
import type { Collaborator } from '../../domain/entities/Collaborator';
import type { NotificationTemplate } from '../../domain/entities/NotificationTemplate';
import type { PlatformIdentity } from '../../domain/entities/PlatformIdentity';

export interface FetchAllResponse {
  identity: PlatformIdentity;
  collaborators: Collaborator[];
  templates: NotificationTemplate[];
  changeLog: ChangeLogEntry[];
}

export interface InviteCollaboratorCommand {
  fullName: string;
  email: string;
  role: PlatformUserRole;
}

export interface UpdateTemplateInput {
  subject: string;
  body: string;
}

export interface PlatformSettingsGateway {
  fetchAll: () => Promise<FetchAllResponse>;
  updateIdentity: (changes: Partial<PlatformIdentity>) => Promise<PlatformIdentity>;
  inviteCollaborator: (command: InviteCollaboratorCommand) => Promise<Collaborator>;
  changeCollaboratorRole: (collaboratorId: string, newRole: PlatformUserRole) => Promise<Collaborator>;
  revokeCollaborator: (collaboratorId: string, reason: string) => Promise<void>;
  resendInvitation: (collaboratorId: string) => Promise<{ maskedEmail: string }>;
  updateTemplate: (id: string, input: UpdateTemplateInput) => Promise<NotificationTemplate>;
}
