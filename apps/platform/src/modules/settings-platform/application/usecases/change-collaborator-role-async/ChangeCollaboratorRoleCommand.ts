import type { PlatformUserRole } from '@/modules/auth';

export interface ChangeCollaboratorRoleCommand {
  collaboratorId: string;
  newRole: PlatformUserRole;
}
