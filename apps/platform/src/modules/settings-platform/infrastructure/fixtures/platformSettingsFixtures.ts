import type { ChangeLogEntry } from '@miya/kernel';
import { PlatformUserRole } from '@/modules/auth';
import { CollaboratorStatus, type Collaborator } from '../../domain/entities/Collaborator';
import { NotificationTemplateKind, type NotificationTemplate } from '../../domain/entities/NotificationTemplate';
import type { PlatformIdentity } from '../../domain/entities/PlatformIdentity';

const daysAgo = (days: number): string => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

/** Identité de l'éditeur — coordonnées plausibles Yaoundé, mentions de facturation fidèles à la maquette 5a. */
export const identityFixture: PlatformIdentity = {
  name: 'Miya',
  legalName: 'Miya SAS',
  taxNumber: 'P0782 1904 8827 M',
  logoUrl: undefined,
  contacts: { email: 'facturation@miya.cm', phone: '+237 6 98 44 21 07' },
  invoiceMentions:
    "Miya SAS · RCCM RC/YAO/2023/B/1204 · siège : Bastos, Yaoundé, Cameroun. Paiement par virement ou mobile money sous 15 jours. TVA non applicable, art. 293 CGI.",
};

/** Le compte de démo (Owner) + un Lecture actif + un Invited en attente — fidèle à la maquette 5a. */
export const collaboratorFixtures: Collaborator[] = [
  {
    id: 'super-admin-cesar',
    fullName: 'César Vanel',
    email: 'cesar@miya.cm',
    role: PlatformUserRole.Owner,
    status: CollaboratorStatus.Active,
    lastActiveAt: daysAgo(0),
  },
  {
    id: 'admin-fouda',
    fullName: 'Brice Fouda',
    email: 'b.fouda@miya.cm',
    role: PlatformUserRole.ReadOnly,
    status: CollaboratorStatus.Active,
    lastActiveAt: daysAgo(2),
  },
  {
    id: 'admin-nkeng',
    fullName: 'Aline Nkeng',
    email: 'a.nkeng@miya.cm',
    role: PlatformUserRole.ReadOnly,
    status: CollaboratorStatus.Invited,
    invitedAt: daysAgo(4),
  },
];

/**
 * 4 modèles pré-remplis en français. Le PaymentReminder mentionne
 * {{suspensionDate}}, cohérent avec l'escalade billing (relance → suspension
 * programmée à échéance + 15 jours).
 */
export const templateFixtures: NotificationTemplate[] = [
  {
    id: 'tpl-welcome',
    kind: NotificationTemplateKind.Welcome,
    subject: 'Bienvenue sur Miya 🎉',
    body: "Bonjour {{adminName}}, le compte de {{bankName}} est actif. Invitez vos agents et démarrez la collecte dès aujourd'hui.",
    lastEditedBy: 'César Vanel',
    lastEditedAt: daysAgo(90),
  },
  {
    id: 'tpl-payment-reminder',
    kind: NotificationTemplateKind.PaymentReminder,
    subject: 'Facture {{bankName}} en attente de règlement',
    body:
      "Bonjour, la facture de {{bankName}} d'un montant de {{amount}} est échue le {{dueDate}}. Sans règlement, l'accès sera suspendu le {{suspensionDate}}.",
    lastEditedBy: 'César Vanel',
    lastEditedAt: daysAgo(60),
  },
  {
    id: 'tpl-suspension-notice',
    kind: NotificationTemplateKind.SuspensionNotice,
    subject: 'Accès {{bankName}} suspendu',
    body: "Bonjour, l'accès de {{bankName}} a été suspendu suite à un impayé persistant. Contactez notre équipe pour régulariser votre situation.",
    lastEditedBy: 'César Vanel',
    lastEditedAt: daysAgo(60),
  },
  {
    id: 'tpl-plan-changed',
    kind: NotificationTemplateKind.PlanChanged,
    subject: 'Votre plan a changé',
    body: '{{bankName}} est désormais sur le plan {{planName}}. Les nouvelles limites sont effectives dès le prochain cycle de facturation.',
    lastEditedBy: 'César Vanel',
    lastEditedAt: daysAgo(30),
  },
];

export const changeLogFixtures: ChangeLogEntry[] = [
  {
    id: 'pset-chg-1',
    at: daysAgo(90),
    by: 'César Vanel',
    section: 'Identité Miya',
    field: 'Mentions bas de facture',
    oldValue: '—',
    newValue: 'RCCM RC/YAO/2023/B/1204 ajouté',
  },
  {
    id: 'pset-chg-2',
    at: daysAgo(60),
    by: 'César Vanel',
    section: 'Notifications',
    field: 'Modèle « Facture en attente de règlement »',
    oldValue: 'Sans mention de suspension',
    newValue: 'Facture {{bankName}} en attente de règlement',
  },
  {
    id: 'pset-chg-3',
    at: daysAgo(4),
    by: 'César Vanel',
    section: 'Comptes super admin',
    field: 'Collaborateur invité',
    oldValue: '—',
    newValue: 'Aline Nkeng · Lecture',
  },
];
