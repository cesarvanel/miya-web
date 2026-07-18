import type { PlatformUserRole } from '@/modules/auth';
import type {
  FetchAllResponse,
  InviteCollaboratorCommand,
  PlatformSettingsGateway,
  UpdateTemplateInput,
} from '../../application/ports/PlatformSettingsGateway';
import { CollaboratorStatus, type Collaborator } from '../../domain/entities/Collaborator';
import type { NotificationTemplate } from '../../domain/entities/NotificationTemplate';
import type { PlatformIdentity } from '../../domain/entities/PlatformIdentity';
import { changeLogFixtures, collaboratorFixtures, identityFixture, templateFixtures } from '../fixtures/platformSettingsFixtures';

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

const maskEmail = (email: string): string => {
  const [local, domain] = email.split('@');
  if (!domain) {
    return `${email.slice(0, 2)}•••`;
  }
  const dotIndex = local.indexOf('.');
  const kept = dotIndex >= 0 ? local.slice(0, dotIndex + 1) : local.slice(0, 1);
  return `${kept}•••@${domain}`;
};

let identity: PlatformIdentity = { ...identityFixture, contacts: { ...identityFixture.contacts } };
let nextCollaboratorSeq = collaboratorFixtures.length + 1;

const findCollaboratorIndex = (collaboratorId: string): number =>
  collaboratorFixtures.findIndex((candidate) => candidate.id === collaboratorId);
const findTemplateIndex = (templateId: string): number => templateFixtures.findIndex((candidate) => candidate.id === templateId);

/**
 * Gateway en mémoire — lit/écrit les fixtures du module. Ne renvoie et ne
 * stocke jamais les objets de fixture PAR RÉFÉRENCE (Redux/Immer gèle les
 * objets qui entrent dans le store) : lecture = clone, écriture = remplacement
 * d'élément — même règle que les autres Fake gateways du projet.
 */
export class FakePlatformSettingsGateway implements PlatformSettingsGateway {
  async fetchAll(): Promise<FetchAllResponse> {
    await delay();
    return {
      identity: { ...identity, contacts: { ...identity.contacts } },
      collaborators: collaboratorFixtures.map((collaborator) => ({ ...collaborator })),
      templates: templateFixtures.map((template) => ({ ...template })),
      changeLog: changeLogFixtures.map((entry) => ({ ...entry })),
    };
  }

  async updateIdentity(changes: Partial<PlatformIdentity>): Promise<PlatformIdentity> {
    await delay();
    identity = { ...identity, ...changes, contacts: { ...identity.contacts, ...changes.contacts } };
    return { ...identity, contacts: { ...identity.contacts } };
  }

  async inviteCollaborator(command: InviteCollaboratorCommand): Promise<Collaborator> {
    await delay();
    const collaborator: Collaborator = {
      id: `collaborator-local-${nextCollaboratorSeq++}`,
      fullName: command.fullName,
      email: command.email,
      role: command.role,
      status: CollaboratorStatus.Invited,
      invitedAt: new Date().toISOString(),
    };
    collaboratorFixtures.push(collaborator);
    return { ...collaborator };
  }

  async changeCollaboratorRole(collaboratorId: string, newRole: PlatformUserRole): Promise<Collaborator> {
    await delay();
    const index = findCollaboratorIndex(collaboratorId);
    if (index === -1) {
      throw new Error('Collaborateur introuvable.');
    }
    const updated: Collaborator = { ...collaboratorFixtures[index], role: newRole };
    collaboratorFixtures[index] = updated;
    return { ...updated };
  }

  async revokeCollaborator(collaboratorId: string, _reason: string): Promise<void> {
    await delay();
    const index = findCollaboratorIndex(collaboratorId);
    if (index === -1) {
      throw new Error('Collaborateur introuvable.');
    }
    collaboratorFixtures.splice(index, 1);
  }

  async resendInvitation(collaboratorId: string): Promise<{ maskedEmail: string }> {
    await delay();
    const collaborator = collaboratorFixtures.find((candidate) => candidate.id === collaboratorId);
    if (!collaborator) {
      throw new Error('Collaborateur introuvable.');
    }
    return { maskedEmail: maskEmail(collaborator.email) };
  }

  async updateTemplate(id: string, input: UpdateTemplateInput): Promise<NotificationTemplate> {
    await delay();
    const index = findTemplateIndex(id);
    if (index === -1) {
      throw new Error('Modèle introuvable.');
    }
    const updated: NotificationTemplate = {
      ...templateFixtures[index],
      subject: input.subject,
      body: input.body,
      lastEditedBy: 'César Vanel',
      lastEditedAt: new Date().toISOString(),
    };
    templateFixtures[index] = updated;
    return { ...updated };
  }
}
