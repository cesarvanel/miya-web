import { createAction } from '@reduxjs/toolkit';
import type { PlatformUserRole } from '@/modules/auth';

export interface CollaboratorAddedEvent {
  collaboratorId: string;
  collaboratorName: string;
  role: PlatformUserRole;
  by: string;
  byId: string;
  /** ISO. */
  at: string;
}

/** Event de domaine dispatché par `InviteCollaboratorAsync` — le module activity s'y abonne pour journaliser l'action (AuditAction.CollaboratorAdded), via cet index public. */
export const collaboratorAdded = createAction<CollaboratorAddedEvent>('platformSettings/collaboratorAdded');
