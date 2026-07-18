import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { ChangeLogAdapter, type ChangeLogEntry } from '@miya/kernel';
import { PlatformUserRole } from '@/modules/auth';
import { collaboratorsAdapter, isLastActiveOwner, type Collaborator } from '../entities/Collaborator';
import { validateTemplateBody, templatesAdapter } from '../entities/NotificationTemplate';
import type { PlatformIdentity } from '../entities/PlatformIdentity';
import { FetchPlatformSettingsAsync } from '../../application/usecases/fetch-platform-settings-async/FetchPlatformSettingsAsync';

const initialState = {
  identity: null as PlatformIdentity | null,
  collaborators: collaboratorsAdapter.getInitialState(),
  templates: templatesAdapter.getInitialState(),
  changeLog: ChangeLogAdapter.getInitialState(),
};

export type PlatformSettingsState = typeof initialState;

let nextEntrySeq = 1;
const nextEntryId = (): string => `chg-local-${Date.now()}-${nextEntrySeq++}`;

const pushEntry = (state: PlatformSettingsState, entry: Omit<ChangeLogEntry, 'id'>): void => {
  ChangeLogAdapter.addOne(state.changeLog, { ...entry, id: nextEntryId() });
};

const ROLE_LABEL: Record<PlatformUserRole, string> = {
  [PlatformUserRole.Owner]: 'Complet',
  [PlatformUserRole.ReadOnly]: 'Lecture',
};

const SECTION = {
  Identity: 'Identité Miya',
  Collaborators: 'Comptes super admin',
  Notifications: 'Notifications',
} as const;

/**
 * platform-settings.slice — transitions avec GARDE-FOUS :
 *  - impossible de retirer ou rétrograder le DERNIER Owner actif (silencieux
 *    ici, en défense en profondeur — l'erreur claire est produite en amont
 *    par l'use case via `isLastActiveOwner`, avant même d'appeler la gateway) ;
 *  - un collaborateur ne peut pas modifier son propre rôle ;
 *  - un template garde ses variables obligatoires (`validateTemplateBody`).
 */
export const platformSettingsSlice = createSlice({
  name: 'platformSettings',
  initialState,
  reducers: {
    identityUpdated: (state, action: PayloadAction<{ by: string; at: string; changes: Partial<PlatformIdentity> }>) => {
      if (!state.identity) {
        return;
      }
      const { by, at, changes } = action.payload;
      const identity = state.identity;

      const textFieldChanges: Array<[keyof PlatformIdentity, string]> = [
        ['name', 'Nom'],
        ['legalName', 'Raison sociale'],
        ['taxNumber', 'N° contribuable'],
        ['invoiceMentions', 'Mentions bas de facture'],
      ];
      for (const [key, label] of textFieldChanges) {
        const incoming = changes[key];
        if (typeof incoming === 'string' && incoming !== identity[key]) {
          pushEntry(state, { at, by, section: SECTION.Identity, field: label, oldValue: String(identity[key]), newValue: incoming });
        }
      }
      if (changes.contacts && (changes.contacts.phone !== identity.contacts.phone || changes.contacts.email !== identity.contacts.email)) {
        pushEntry(state, {
          at,
          by,
          section: SECTION.Identity,
          field: 'Coordonnées',
          oldValue: `${identity.contacts.phone} · ${identity.contacts.email}`,
          newValue: `${changes.contacts.phone ?? identity.contacts.phone} · ${changes.contacts.email ?? identity.contacts.email}`,
        });
      }
      if (changes.logoUrl !== undefined && changes.logoUrl !== identity.logoUrl) {
        pushEntry(state, { at, by, section: SECTION.Identity, field: 'Logo', oldValue: identity.logoUrl ?? '—', newValue: changes.logoUrl });
      }

      state.identity = { ...identity, ...changes };
    },

    collaboratorInvited: (state, action: PayloadAction<{ collaborator: Collaborator; by: string; at: string }>) => {
      const { collaborator, by, at } = action.payload;
      collaboratorsAdapter.addOne(state.collaborators, collaborator);
      pushEntry(state, {
        at,
        by,
        section: SECTION.Collaborators,
        field: 'Collaborateur invité',
        oldValue: '—',
        newValue: `${collaborator.fullName} · ${ROLE_LABEL[collaborator.role]}`,
      });
    },

    /** Garde-fous : ni auto-modification, ni rétrogradation du dernier Owner actif. */
    collaboratorRoleChanged: (
      state,
      action: PayloadAction<{ collaboratorId: string; newRole: PlatformUserRole; by: string; byId: string; at: string }>,
    ) => {
      const { collaboratorId, newRole, by, byId, at } = action.payload;
      if (byId === collaboratorId) {
        return;
      }
      const collaborator = state.collaborators.entities[collaboratorId];
      if (!collaborator) {
        return;
      }
      const collaborators = collaboratorsAdapter.getSelectors().selectAll(state.collaborators);
      if (newRole === PlatformUserRole.ReadOnly && isLastActiveOwner(collaborators, collaboratorId)) {
        return;
      }
      const previousRole = collaborator.role;
      collaboratorsAdapter.updateOne(state.collaborators, { id: collaboratorId, changes: { role: newRole } });
      pushEntry(state, {
        at,
        by,
        section: SECTION.Collaborators,
        field: `Rôle de ${collaborator.fullName}`,
        oldValue: ROLE_LABEL[previousRole],
        newValue: ROLE_LABEL[newRole],
      });
    },

    /** Garde-fous : ni auto-révocation, ni retrait du dernier Owner actif. */
    collaboratorRevoked: (
      state,
      action: PayloadAction<{ collaboratorId: string; reason: string; by: string; byId: string; at: string }>,
    ) => {
      const { collaboratorId, reason, by, byId, at } = action.payload;
      if (byId === collaboratorId) {
        return;
      }
      const collaborator = state.collaborators.entities[collaboratorId];
      if (!collaborator) {
        return;
      }
      const collaborators = collaboratorsAdapter.getSelectors().selectAll(state.collaborators);
      if (isLastActiveOwner(collaborators, collaboratorId)) {
        return;
      }
      collaboratorsAdapter.removeOne(state.collaborators, collaboratorId);
      pushEntry(state, {
        at,
        by,
        section: SECTION.Collaborators,
        field: 'Collaborateur révoqué',
        oldValue: collaborator.fullName,
        newValue: `Révoqué — motif : ${reason}`,
      });
    },

    invitationResent: (state, action: PayloadAction<{ collaboratorId: string; by: string; at: string }>) => {
      const { collaboratorId, by, at } = action.payload;
      const collaborator = state.collaborators.entities[collaboratorId];
      if (!collaborator) {
        return;
      }
      collaboratorsAdapter.updateOne(state.collaborators, { id: collaboratorId, changes: { invitedAt: at } });
      pushEntry(state, { at, by, section: SECTION.Collaborators, field: 'Invitation renvoyée', oldValue: '—', newValue: collaborator.fullName });
    },

    /** Garde-fou : un body sans ses variables obligatoires (ex. {{bankName}} pour un PaymentReminder) est rejeté. */
    templateUpdated: (state, action: PayloadAction<{ templateId: string; subject: string; body: string; by: string; at: string }>) => {
      const { templateId, subject, body, by, at } = action.payload;
      const template = state.templates.entities[templateId];
      if (!template) {
        return;
      }
      if (!validateTemplateBody(template.kind, body).valid) {
        return;
      }
      const previousSubject = template.subject;
      templatesAdapter.updateOne(state.templates, { id: templateId, changes: { subject, body, lastEditedBy: by, lastEditedAt: at } });
      pushEntry(state, {
        at,
        by,
        section: SECTION.Notifications,
        field: `Modèle « ${previousSubject} »`,
        oldValue: previousSubject,
        newValue: subject,
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(FetchPlatformSettingsAsync.fulfilled, (state, action) => {
      state.identity = action.payload.identity;
      collaboratorsAdapter.setAll(state.collaborators, action.payload.collaborators);
      templatesAdapter.setAll(state.templates, action.payload.templates);
      ChangeLogAdapter.upsertMany(state.changeLog, action.payload.changeLog);
    });
  },
});

export const PlatformSettingsActions = platformSettingsSlice.actions;
