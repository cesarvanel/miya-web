import { createEntityAdapter } from '@reduxjs/toolkit';
import { PlatformUserRole } from '@/modules/auth';

export const CollaboratorStatus = { Active: 'Active', Invited: 'Invited' } as const;
export type CollaboratorStatus = (typeof CollaboratorStatus)[keyof typeof CollaboratorStatus];

export interface Collaborator {
  id: string;
  fullName: string;
  email: string;
  /** Même énumération que le rôle de session (`PlatformUserRole`) — c'est le même concept. */
  role: PlatformUserRole;
  status: CollaboratorStatus;
  /** ISO — posé à l'invitation. */
  invitedAt?: string;
  /** ISO — dernière activité connue ; absent tant que l'invitation n'est pas acceptée. */
  lastActiveAt?: string;
}

export const collaboratorsAdapter = createEntityAdapter<Collaborator, string>({
  selectId: (collaborator) => collaborator.id,
});

/**
 * Garde-fou central : la plateforme doit toujours garder au moins un compte
 * Complet actif. Fonction pure (pas un selector Redux) pour être appelée à la
 * fois par le slice (garde-fou silencieux) et par les use cases (message
 * d'erreur clair, avant même d'appeler la gateway).
 */
export const isLastActiveOwner = (collaborators: Collaborator[], collaboratorId: string): boolean => {
  const target = collaborators.find((collaborator) => collaborator.id === collaboratorId);
  if (!target || target.role !== PlatformUserRole.Owner || target.status !== CollaboratorStatus.Active) {
    return false;
  }
  const otherActiveOwners = collaborators.filter(
    (collaborator) =>
      collaborator.id !== collaboratorId &&
      collaborator.role === PlatformUserRole.Owner &&
      collaborator.status === CollaboratorStatus.Active,
  );
  return otherActiveOwners.length === 0;
};
