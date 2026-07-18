import { PlatformUserRole } from '@/modules/auth';
import { collaboratorsAdapter, CollaboratorStatus, type Collaborator } from '../entities/Collaborator';
import { NotificationTemplateKind, templatesAdapter, type NotificationTemplate } from '../entities/NotificationTemplate';
import { platformSettingsSlice, PlatformSettingsActions } from './PlatformSettingsSlice';

const makeCollaborator = (overrides: Partial<Collaborator> = {}): Collaborator => ({
  id: 'collab-1',
  fullName: 'Test Collaborateur',
  email: 't.collaborateur@miya.cm',
  role: PlatformUserRole.ReadOnly,
  status: CollaboratorStatus.Active,
  ...overrides,
});

const makeTemplate = (overrides: Partial<NotificationTemplate> = {}): NotificationTemplate => ({
  id: 'tpl-1',
  kind: NotificationTemplateKind.PaymentReminder,
  subject: 'Facture {{bankName}} en attente',
  body: 'Bonjour, la facture de {{bankName}} de {{amount}} est échue le {{dueDate}}.',
  lastEditedBy: 'César Vanel',
  lastEditedAt: '2026-01-01T09:00:00.000Z',
  ...overrides,
});

const stateWith = (collaborators: Collaborator[], templates: NotificationTemplate[] = []) => {
  const initial = platformSettingsSlice.reducer(undefined, { type: '@@init' });
  return {
    ...initial,
    collaborators: collaboratorsAdapter.setAll(initial.collaborators, collaborators),
    templates: templatesAdapter.setAll(initial.templates, templates),
  };
};

describe('platformSettingsSlice', () => {
  describe('collaboratorRoleChanged', () => {
    it('is rejected when demoting the last active Owner', () => {
      const state = stateWith([makeCollaborator({ id: 'owner-1', role: PlatformUserRole.Owner })]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.collaboratorRoleChanged({
          collaboratorId: 'owner-1',
          newRole: PlatformUserRole.ReadOnly,
          by: 'Autre Admin',
          byId: 'other-admin',
          at: '2026-07-17T10:00:00.000Z',
        }),
      );

      expect(next.collaborators.entities['owner-1']?.role).toBe(PlatformUserRole.Owner);
      expect(Object.keys(next.changeLog.entities)).toHaveLength(0);
    });

    it('succeeds when demoting an Owner while another active Owner remains', () => {
      const state = stateWith([
        makeCollaborator({ id: 'owner-1', role: PlatformUserRole.Owner }),
        makeCollaborator({ id: 'owner-2', role: PlatformUserRole.Owner }),
      ]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.collaboratorRoleChanged({
          collaboratorId: 'owner-1',
          newRole: PlatformUserRole.ReadOnly,
          by: 'owner-2 name',
          byId: 'owner-2',
          at: '2026-07-17T10:00:00.000Z',
        }),
      );

      expect(next.collaborators.entities['owner-1']?.role).toBe(PlatformUserRole.ReadOnly);
      expect(Object.keys(next.changeLog.entities)).toHaveLength(1);
    });

    it('is rejected when a collaborator tries to change their own role', () => {
      const state = stateWith([
        makeCollaborator({ id: 'owner-1', role: PlatformUserRole.Owner }),
        makeCollaborator({ id: 'owner-2', role: PlatformUserRole.Owner }),
      ]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.collaboratorRoleChanged({
          collaboratorId: 'owner-1',
          newRole: PlatformUserRole.ReadOnly,
          by: 'owner-1 name',
          byId: 'owner-1',
          at: '2026-07-17T10:00:00.000Z',
        }),
      );

      expect(next.collaborators.entities['owner-1']?.role).toBe(PlatformUserRole.Owner);
    });
  });

  describe('collaboratorRevoked', () => {
    it('is rejected when revoking the last active Owner', () => {
      const state = stateWith([makeCollaborator({ id: 'owner-1', role: PlatformUserRole.Owner })]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.collaboratorRevoked({ collaboratorId: 'owner-1', reason: 'Test', by: 'x', byId: 'other', at: '2026-07-17T10:00:00.000Z' }),
      );

      expect(next.collaborators.entities['owner-1']).toBeDefined();
    });

    it('removes a non-last-Owner collaborator and journals the reason', () => {
      const state = stateWith([
        makeCollaborator({ id: 'owner-1', role: PlatformUserRole.Owner }),
        makeCollaborator({ id: 'readonly-1', role: PlatformUserRole.ReadOnly }),
      ]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.collaboratorRevoked({
          collaboratorId: 'readonly-1',
          reason: 'Départ de l’équipe',
          by: 'owner-1 name',
          byId: 'owner-1',
          at: '2026-07-17T10:00:00.000Z',
        }),
      );

      expect(next.collaborators.entities['readonly-1']).toBeUndefined();
      const entries = Object.values(next.changeLog.entities);
      expect(entries[0]?.newValue).toContain('Départ de l’équipe');
    });
  });

  describe('templateUpdated', () => {
    it('is rejected when the body drops a required variable ({{bankName}} for PaymentReminder)', () => {
      const state = stateWith([], [makeTemplate()]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.templateUpdated({
          templateId: 'tpl-1',
          subject: 'Nouveau sujet',
          body: 'Un body sans les variables obligatoires.',
          by: 'César Vanel',
          at: '2026-07-17T10:00:00.000Z',
        }),
      );

      expect(next.templates.entities['tpl-1']?.body).toBe(state.templates.entities['tpl-1']?.body);
      expect(Object.keys(next.changeLog.entities)).toHaveLength(0);
    });

    it('accepts a body that keeps all required variables', () => {
      const state = stateWith([], [makeTemplate()]);

      const next = platformSettingsSlice.reducer(
        state,
        PlatformSettingsActions.templateUpdated({
          templateId: 'tpl-1',
          subject: 'Nouveau sujet',
          body: 'La facture de {{bankName}} de {{amount}} est échue le {{dueDate}}, sinon suspension.',
          by: 'César Vanel',
          at: '2026-07-17T10:00:00.000Z',
        }),
      );

      expect(next.templates.entities['tpl-1']?.subject).toBe('Nouveau sujet');
    });
  });
});
