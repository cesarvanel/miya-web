import type { PlatformUserRole } from '@/modules/auth';

export interface InviteCollaboratorCommand {
  fullName: string;
  email: string;
  role: PlatformUserRole;
}
