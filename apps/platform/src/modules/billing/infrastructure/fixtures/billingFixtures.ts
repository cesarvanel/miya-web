import { InvoiceStatus, PaymentMethod, scheduleSuspensionFromDueDate, type Invoice } from '../../domain/entities/Invoice';
import { PlanStatus, type Plan } from '../../domain/entities/Plan';

const daysAgo = (days: number): string => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number): string => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

const monthYearLabel = (iso: string): string => {
  const label = new Date(iso).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
};

/**
 * Catalogue des 3 plans — tarifs et limites fidèles à la maquette 3a ; Élite
 * a des plafonds agents/clients illimités (`null`), seules les agences
 * restent plafonnées. `tenantsCount` totalise 26 (9+12+5), cohérent avec
 * l'en-tête de la maquette "26 banques abonnées · 1 en essai" sur 27 au total.
 * Ce catalogue est distinct du `PLAN_CATALOG` interne au module tenants
 * (qui dimensionne des plafonds différents pour ses propres alertes d'usage) :
 * deux contextes métier séparés, volontairement non couplés en code.
 */
export const planFixtures: Plan[] = [
  {
    id: 'plan-essentiel',
    name: 'Essentiel',
    monthlyPrice: 50_000,
    limits: { agents: 15, clients: 3_000, agencies: 2 },
    tenantsCount: 9,
    status: PlanStatus.Active,
  },
  {
    id: 'plan-croissance',
    name: 'Croissance',
    monthlyPrice: 120_000,
    limits: { agents: 40, clients: 10_000, agencies: 5 },
    tenantsCount: 12,
    status: PlanStatus.Active,
  },
  {
    id: 'plan-elite',
    name: 'Élite',
    monthlyPrice: 180_000,
    limits: { agents: null, clients: null, agencies: 10 },
    tenantsCount: 5,
    status: PlanStatus.Active,
  },
];

const coopecDueAt = daysAgo(9);

/**
 * Factures — les identifiants tenant (`coopec-sahel`, `mec-la-confiance`…)
 * correspondent volontairement à ceux de `tenantFixtures` (module tenants)
 * pour que les liens croisés (fiche tenant ↔ facture) et la mini-table de
 * facturation de la fiche tenant pointent vers des données cohérentes —
 * simple correspondance de données, aucun import entre les deux modules.
 */
export const invoiceFixtures: Invoice[] = [
  // COOPEC Sahel — en retard, une relance déjà envoyée, suspension programmée (échéance + 15j).
  {
    id: 'INV-2026-06-0138',
    tenantId: 'coopec-sahel',
    tenantName: 'COOPEC Sahel',
    planId: 'plan-croissance',
    planName: 'Croissance',
    period: monthYearLabel(coopecDueAt),
    amount: 120_000,
    issuedAt: daysAgo(39),
    dueAt: coopecDueAt,
    status: InvoiceStatus.Overdue,
    reminders: [{ sentAt: daysAgo(5), by: 'Relance automatique' }],
    scheduledSuspensionAt: scheduleSuspensionFromDueDate(coopecDueAt),
  },

  // En attente — mois courant.
  {
    id: 'INV-2026-07-0151',
    tenantId: 'la-regionale-mf',
    tenantName: 'La Régionale MF',
    planId: 'plan-croissance',
    planName: 'Croissance',
    period: monthYearLabel(daysFromNow(4)),
    amount: 120_000,
    issuedAt: daysAgo(3),
    dueAt: daysFromNow(4),
    status: InvoiceStatus.Pending,
    reminders: [],
  },
  {
    id: 'INV-2026-07-0152',
    tenantId: 'financia-mf',
    tenantName: 'Financia MF',
    planId: 'plan-croissance',
    planName: 'Croissance',
    period: monthYearLabel(daysFromNow(2)),
    amount: 120_000,
    issuedAt: daysAgo(5),
    dueAt: daysFromNow(2),
    status: InvoiceStatus.Pending,
    reminders: [],
  },

  // Historique payé — méthodes variées.
  {
    id: 'INV-2026-06-0142',
    tenantId: 'mec-la-confiance',
    tenantName: 'MEC La Confiance',
    planId: 'plan-elite',
    planName: 'Élite',
    period: monthYearLabel(daysAgo(14)),
    amount: 180_000,
    issuedAt: daysAgo(20),
    dueAt: daysAgo(14),
    status: InvoiceStatus.Paid,
    reminders: [],
    payment: { receivedAt: daysAgo(14), method: PaymentMethod.BankTransfer, recordedBy: 'S. Etoa', reference: 'VIR-260620.114' },
  },
  {
    id: 'INV-2026-06-0143',
    tenantId: 'camccul-express',
    tenantName: 'CamCCUL Express',
    planId: 'plan-elite',
    planName: 'Élite',
    period: monthYearLabel(daysAgo(16)),
    amount: 180_000,
    issuedAt: daysAgo(22),
    dueAt: daysAgo(16),
    status: InvoiceStatus.Paid,
    reminders: [],
    payment: { receivedAt: daysAgo(16), method: PaymentMethod.MobileMoney, recordedBy: 'S. Etoa', reference: 'MP260618.0912.C31A' },
  },
  {
    id: 'INV-2026-05-0138',
    tenantId: 'coopec-sahel',
    tenantName: 'COOPEC Sahel',
    planId: 'plan-croissance',
    planName: 'Croissance',
    period: monthYearLabel(daysAgo(43)),
    amount: 120_000,
    issuedAt: daysAgo(49),
    dueAt: daysAgo(43),
    status: InvoiceStatus.Paid,
    reminders: [],
    payment: { receivedAt: daysAgo(43), method: PaymentMethod.MobileMoney, recordedBy: 'S. Etoa', reference: 'MP260603.0812.A19F' },
  },
];
