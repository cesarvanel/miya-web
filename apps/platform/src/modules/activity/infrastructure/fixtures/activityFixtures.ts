/** RÈGLE DE CONFIDENTIALITÉ — voir domain/entities/BankUsagePoint.ts : agrégats uniquement. */
import { AuditAction, type AuditEntry } from '../../domain/entities/AuditEntry';
import { computeAdoptionRate, AdoptionTrend, type AdoptionStat } from '../../domain/entities/AdoptionStat';
import { type BankUsagePoint } from '../../domain/entities/BankUsagePoint';
import { computeErrorRate, type SyncHealth } from '../../domain/entities/SyncHealth';

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number): string => new Date(Date.now() - days * DAY_MS).toISOString();
const hoursAgo = (hours: number): string => new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
const isoDate = (days: number): string => daysAgo(days).slice(0, 10);

const USAGE_DAYS = 30;

/**
 * Courbe déterministe (pas de Math.random — fixtures stables) : rampe lente
 * vers aujourd'hui + légère oscillation type jour de semaine.
 */
const buildUsageSeries = (
  tenantId: string,
  baseAgents: number,
  baseSync: number,
  baseCollections: number,
): BankUsagePoint[] =>
  Array.from({ length: USAGE_DAYS }, (_, i) => {
    const daysAgoCount = USAGE_DAYS - 1 - i;
    const progress = i / (USAGE_DAYS - 1);
    const wave = Math.sin(i * 1.1) * 0.06;
    return {
      tenantId,
      date: isoDate(daysAgoCount),
      activeAgents: Math.round(baseAgents * (0.85 + 0.15 * progress)),
      syncCount: Math.round(baseSync * (0.8 + 0.3 * progress) * (1 + wave)),
      collectionsCount: Math.round(baseCollections * (0.8 + 0.3 * progress) * (1 + wave * 0.8)),
    };
  });

/**
 * 3 banques principales — CamCCUL la plus active, cohérent avec son volume
 * mensuel le plus élevé côté tenants (298,4 M > 214,7 M > 128,9 M).
 */
export const usageFixtures: BankUsagePoint[] = [
  ...buildUsageSeries('camccul-express', 51, 2_050, 1_580),
  ...buildUsageSeries('mec-la-confiance', 38, 1_480, 1_120),
  ...buildUsageSeries('la-regionale-mf', 29, 780, 610),
];

const syncEntry = (tenantId: string, tenantName: string, successCount: number, errorCount: number, lastSyncAt: string): SyncHealth => ({
  tenantId,
  tenantName,
  date: isoDate(0),
  successCount,
  errorCount,
  errorRate: computeErrorRate(successCount, errorCount),
  lastSyncAt,
});

/** La Régionale MF en difficulté — 12% d'erreurs, dernière synchro il y a 3h (zone à faible réseau, plausible). */
export const syncHealthFixtures: SyncHealth[] = [
  syncEntry('mec-la-confiance', 'MEC La Confiance', 1_550, 9, hoursAgo(0.4)),
  syncEntry('camccul-express', 'CamCCUL Express', 2_100, 14, hoursAgo(0.3)),
  syncEntry('la-regionale-mf', 'La Régionale MF', 700, 96, hoursAgo(3)),
  syncEntry('financia-mf', 'Financia MF', 480, 22, hoursAgo(1.2)),
  syncEntry('coopec-sahel', 'COOPEC Sahel', 300, 11, hoursAgo(0.8)),
];

const adoptionEntry = (
  tenantId: string,
  tenantName: string,
  agentsCreated: number,
  agentsActive30d: number,
  trend: AdoptionTrend,
): AdoptionStat => ({
  tenantId,
  tenantName,
  agentsCreated,
  agentsActive30d,
  adoptionRate: computeAdoptionRate(agentsActive30d, agentsCreated),
  trend,
});

/** Mutuelle Espoir (essai) la plus faible — 14 créés / 8 actifs, à accompagner. Chiffres alignés sur la maquette 4a. */
export const adoptionFixtures: AdoptionStat[] = [
  adoptionEntry('mec-la-confiance', 'MEC La Confiance', 38, 34, AdoptionTrend.Up),
  adoptionEntry('camccul-express', 'CamCCUL Express', 51, 44, AdoptionTrend.Up),
  adoptionEntry('la-regionale-mf', 'La Régionale MF', 29, 24, AdoptionTrend.Flat),
  adoptionEntry('financia-mf', 'Financia MF', 22, 13, AdoptionTrend.Down),
  adoptionEntry('coopec-sahel', 'COOPEC Sahel', 15, 9, AdoptionTrend.Down),
  adoptionEntry('mutuelle-espoir-douala', 'Mutuelle Espoir Douala', 14, 8, AdoptionTrend.Flat),
];

const DEMO_ACTOR = { id: 'super-admin-cesar', name: 'César Vanel' };

/**
 * Journal d'audit — reprend des actions déjà "jouées" par les fixtures des
 * autres modules (suspension, changement de plan, paiements COOPEC/MEC/
 * CamCCUL…), toutes signées par le compte de démo. Un `ReminderSent` n'y
 * figure volontairement pas : la relance déjà présente dans les fixtures
 * billing (COOPEC Sahel) est envoyée par « Relance automatique », pas par un
 * super admin — seules les actions humaines entrent dans cette piste d'audit.
 */
export const auditLogFixtures: AuditEntry[] = [
  {
    id: 'audit-1',
    at: '2024-11-14T08:30:00.000Z',
    actor: DEMO_ACTOR,
    action: AuditAction.TenantCreated,
    targetTenant: { id: 'coopec-sahel', name: 'COOPEC Sahel' },
    summary: "a créé la banque COOPEC Sahel et invité l'administrateur",
  },
  {
    id: 'audit-2',
    at: '2026-03-02T09:00:00.000Z',
    actor: DEMO_ACTOR,
    action: AuditAction.PlanChanged,
    targetTenant: { id: 'mec-la-confiance', name: 'MEC La Confiance' },
    summary: 'a fait passer MEC La Confiance du plan Croissance à Élite',
  },
  {
    id: 'audit-3',
    at: daysAgo(43),
    actor: DEMO_ACTOR,
    action: AuditAction.InvoiceMarkedPaid,
    targetTenant: { id: 'coopec-sahel', name: 'COOPEC Sahel' },
    summary: 'a enregistré un paiement de COOPEC Sahel · 120 000 FCFA',
    ipMasked: '154.72.•••.14',
  },
  {
    id: 'audit-4',
    at: '2026-06-10T09:00:00.000Z',
    actor: DEMO_ACTOR,
    action: AuditAction.InvoiceMarkedPaid,
    targetTenant: { id: 'la-regionale-mf', name: 'La Régionale MF' },
    summary: 'a enregistré un paiement de La Régionale MF · 120 000 FCFA',
  },
  {
    id: 'audit-5',
    at: daysAgo(16),
    actor: DEMO_ACTOR,
    action: AuditAction.InvoiceMarkedPaid,
    targetTenant: { id: 'camccul-express', name: 'CamCCUL Express' },
    summary: 'a enregistré un paiement de CamCCUL Express · 180 000 FCFA',
    ipMasked: '154.72.•••.14',
  },
  {
    id: 'audit-6',
    at: '2026-06-20T09:00:00.000Z',
    actor: DEMO_ACTOR,
    action: AuditAction.InvoiceMarkedPaid,
    targetTenant: { id: 'financia-mf', name: 'Financia MF' },
    summary: 'a enregistré un paiement de Financia MF · 120 000 FCFA',
  },
  {
    id: 'audit-7',
    at: daysAgo(14),
    actor: DEMO_ACTOR,
    action: AuditAction.InvoiceMarkedPaid,
    targetTenant: { id: 'mec-la-confiance', name: 'MEC La Confiance' },
    summary: 'a enregistré un paiement de MEC La Confiance · 180 000 FCFA',
    ipMasked: '154.72.•••.14',
  },
  {
    id: 'audit-8',
    at: daysAgo(120),
    actor: DEMO_ACTOR,
    action: AuditAction.TenantSuspended,
    targetTenant: { id: 'alliance-populaire', name: 'Alliance Populaire' },
    summary: "a suspendu Alliance Populaire — motif : Impayé d'abonnement — suspension jusqu'au règlement.",
  },
  {
    id: 'audit-9',
    at: daysAgo(1),
    actor: DEMO_ACTOR,
    action: AuditAction.TenantCreated,
    targetTenant: { id: 'union-financiere-ouest', name: "Union Financière de l'Ouest" },
    summary: "a créé la banque Union Financière de l'Ouest et invité l'administrateur",
  },
  {
    id: 'audit-10',
    at: daysAgo(210),
    actor: DEMO_ACTOR,
    action: AuditAction.CollaboratorAdded,
    summary: 'a ajouté A. Nkeng comme collaborateur de la console éditeur',
  },
];
