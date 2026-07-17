import {
  BillingStatus,
  TenantEventKind,
  TenantStatus,
  type Tenant,
  type TenantEvent,
  type TenantPlan,
  type TenantUsage,
} from '../../domain/entities/Tenant';

export interface PlanCatalogEntry {
  plan: TenantPlan;
  limits: TenantUsage;
}

/**
 * Limites par palier — seule la tarification et les plafonds Élite (60 agents ·
 * 20k clients · 8 agences) sont donnés par la maquette (fiche MEC La Confiance) ;
 * Essentiel/Croissance sont dimensionnés en cohérence pour ne pas déclencher
 * d'alerte de plafond sur les tenants de la maquette qui n'en ont pas.
 */
export const PLAN_CATALOG: Record<string, PlanCatalogEntry> = {
  'plan-essentiel': {
    plan: { id: 'plan-essentiel', name: 'Essentiel', monthlyPrice: 50_000 },
    limits: { agents: { used: 0, limit: 15 }, clients: { used: 0, limit: 3_000 }, agencies: { used: 0, limit: 2 } },
  },
  'plan-croissance': {
    plan: { id: 'plan-croissance', name: 'Croissance', monthlyPrice: 120_000 },
    limits: { agents: { used: 0, limit: 40 }, clients: { used: 0, limit: 12_000 }, agencies: { used: 0, limit: 6 } },
  },
  'plan-elite': {
    plan: { id: 'plan-elite', name: 'Élite', monthlyPrice: 180_000 },
    limits: { agents: { used: 0, limit: 60 }, clients: { used: 0, limit: 20_000 }, agencies: { used: 0, limit: 8 } },
  },
};

const usage = (used: TenantUsage, limits: TenantUsage): TenantUsage => ({
  agents: { used: used.agents.used, limit: limits.agents.limit },
  clients: { used: used.clients.used, limit: limits.clients.limit },
  agencies: { used: used.agencies.used, limit: limits.agencies.limit },
});

const daysAgo = (days: number): string => new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
const daysFromNow = (days: number): string => new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString();

/** 6 points de tendance — MEC La Confiance suit exactement les hauteurs de la maquette (60→100% de 214,7 M). */
const meclSeries = [0.6, 0.68, 0.72, 0.8, 0.9, 1].map((ratio, index) => ({
  monthLabel: ['Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'][index],
  volume: Math.round(214_700_000 * ratio),
}));

const smoothSeries = (target: number): { monthLabel: string; volume: number }[] =>
  [0.72, 0.79, 0.85, 0.9, 0.95, 1].map((ratio, index) => ({
    monthLabel: ['Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'][index],
    volume: Math.round(target * ratio),
  }));

/**
 * Données exactes de la maquette 2a (table des tenants) et 2f/2d (fiches) —
 * agrégats uniquement, aucune donnée métier interne (pas de clients finaux,
 * pas de transactions).
 */
export const tenantFixtures: Tenant[] = [
  {
    id: 'mec-la-confiance',
    name: 'MEC La Confiance',
    city: 'Yaoundé',
    legalName: 'MEC La Confiance SA',
    cobacApproval: 'D-2019-114',
    adminContact: { name: 'Rosalie Mbarga', email: 'r.mbarga@meclaconfiance.cm', phone: '+237 6 99 41 20 05' },
    plan: PLAN_CATALOG['plan-elite'].plan,
    usage: usage({ agents: { used: 38, limit: 0 }, clients: { used: 12_400, limit: 0 }, agencies: { used: 4, limit: 0 } }, PLAN_CATALOG['plan-elite'].limits),
    volumeMonth: 214_700_000,
    volumeSeries: meclSeries,
    status: TenantStatus.Active,
    billingStatus: BillingStatus.UpToDate,
    registeredAt: '2024-04-09T09:00:00.000Z',
  },
  {
    id: 'camccul-express',
    name: 'CamCCUL Express',
    city: 'Bamenda',
    legalName: 'CamCCUL Express SA',
    cobacApproval: 'D-2018-076',
    adminContact: { name: 'Ernest Fonkou', email: 'e.fonkou@camccul-express.cm', phone: '+237 6 75 40 12 88' },
    plan: PLAN_CATALOG['plan-elite'].plan,
    usage: usage({ agents: { used: 51, limit: 0 }, clients: { used: 15_100, limit: 0 }, agencies: { used: 6, limit: 0 } }, PLAN_CATALOG['plan-elite'].limits),
    volumeMonth: 298_400_000,
    volumeSeries: smoothSeries(298_400_000),
    status: TenantStatus.Active,
    billingStatus: BillingStatus.UpToDate,
    registeredAt: '2024-01-15T09:00:00.000Z',
  },
  {
    id: 'la-regionale-mf',
    name: 'La Régionale MF',
    city: 'Douala',
    legalName: 'La Régionale Microfinance SA',
    cobacApproval: 'D-2020-201',
    adminContact: { name: 'Solange Ekwalla', email: 's.ekwalla@laregionale-mf.cm', phone: '+237 6 92 18 44 09' },
    plan: PLAN_CATALOG['plan-croissance'].plan,
    usage: usage({ agents: { used: 29, limit: 0 }, clients: { used: 9_200, limit: 0 }, agencies: { used: 3, limit: 0 } }, PLAN_CATALOG['plan-croissance'].limits),
    volumeMonth: 128_900_000,
    volumeSeries: smoothSeries(128_900_000),
    status: TenantStatus.Active,
    billingStatus: BillingStatus.UpToDate,
    registeredAt: '2024-09-10T09:00:00.000Z',
  },
  {
    id: 'financia-mf',
    name: 'Financia MF',
    city: 'Bafoussam',
    legalName: 'Financia Microfinance SA',
    cobacApproval: 'D-2019-142',
    adminContact: { name: 'Patrice Nguemo', email: 'p.nguemo@financia-mf.cm', phone: '+237 6 80 55 21 63' },
    plan: PLAN_CATALOG['plan-croissance'].plan,
    usage: usage({ agents: { used: 22, limit: 0 }, clients: { used: 6_800, limit: 0 }, agencies: { used: 3, limit: 0 } }, PLAN_CATALOG['plan-croissance'].limits),
    volumeMonth: 96_100_000,
    volumeSeries: smoothSeries(96_100_000),
    status: TenantStatus.Active,
    billingStatus: BillingStatus.UpToDate,
    // Corrigé vs la maquette (qui affichait 02/2026, incohérent avec un volume
    // déjà établi à 96,1 M) — inscription ancienne cohérente avec le volume.
    registeredAt: '2024-11-20T09:00:00.000Z',
  },
  {
    id: 'mutuelle-espoir-douala',
    name: 'Mutuelle Espoir Douala',
    city: 'Douala',
    legalName: 'Mutuelle Espoir Douala SA',
    adminContact: { name: 'Christelle Manga', email: 'c.manga@mutuelle-espoir.cm', phone: '+237 6 96 30 77 41' },
    plan: PLAN_CATALOG['plan-essentiel'].plan,
    usage: usage({ agents: { used: 6, limit: 0 }, clients: { used: 420, limit: 0 }, agencies: { used: 1, limit: 0 } }, PLAN_CATALOG['plan-essentiel'].limits),
    volumeMonth: 3_900_000,
    volumeSeries: [{ monthLabel: 'Juil', volume: 3_900_000 }],
    status: TenantStatus.Trial,
    trialEndsAt: daysFromNow(3),
    billingStatus: BillingStatus.UpToDate,
    registeredAt: daysAgo(27),
  },
  {
    id: 'coopec-sahel',
    name: 'COOPEC Sahel',
    city: 'Maroua',
    legalName: 'COOPEC Sahel',
    cobacApproval: 'D-2021-089',
    adminContact: { name: 'Aboubakar Djibril', email: 'a.djibril@coopecsahel.cm', phone: '+237 6 77 30 88 12' },
    plan: PLAN_CATALOG['plan-croissance'].plan,
    usage: usage({ agents: { used: 15, limit: 0 }, clients: { used: 2_200, limit: 0 }, agencies: { used: 2, limit: 0 } }, PLAN_CATALOG['plan-croissance'].limits),
    volumeMonth: 58_300_000,
    volumeSeries: smoothSeries(58_300_000),
    status: TenantStatus.Active,
    billingStatus: BillingStatus.Overdue,
    registeredAt: '2024-11-14T09:00:00.000Z',
  },
  {
    id: 'alliance-populaire',
    name: 'Alliance Populaire',
    city: 'Ngaoundéré',
    legalName: 'Alliance Populaire SA',
    cobacApproval: 'D-2020-133',
    adminContact: { name: 'Joseph Abba', email: 'j.abba@alliance-populaire.cm', phone: '+237 6 71 09 55 20' },
    plan: PLAN_CATALOG['plan-essentiel'].plan,
    usage: usage({ agents: { used: 8, limit: 0 }, clients: { used: 1_400, limit: 0 }, agencies: { used: 1, limit: 0 } }, PLAN_CATALOG['plan-essentiel'].limits),
    volumeMonth: 0,
    volumeSeries: [],
    status: TenantStatus.Suspended,
    billingStatus: BillingStatus.Overdue,
    registeredAt: '2025-03-10T09:00:00.000Z',
    suspension: { by: 'S. Etoa', at: daysAgo(120), reason: "Impayé d'abonnement — suspension jusqu'au règlement." },
  },
  {
    id: 'union-financiere-ouest',
    name: "Union Financière de l'Ouest",
    city: 'Dschang',
    legalName: "Union Financière de l'Ouest SA",
    adminContact: { name: 'Admin UFO', email: 'admin@ufo-dschang.cm' },
    plan: PLAN_CATALOG['plan-croissance'].plan,
    usage: usage({ agents: { used: 0, limit: 0 }, clients: { used: 0, limit: 0 }, agencies: { used: 0, limit: 0 } }, PLAN_CATALOG['plan-croissance'].limits),
    volumeMonth: 0,
    volumeSeries: [],
    status: TenantStatus.Trial,
    trialEndsAt: daysFromNow(30),
    billingStatus: BillingStatus.UpToDate,
    registeredAt: daysAgo(1),
  },
];

export const tenantEventFixtures: Record<string, TenantEvent[]> = {
  'mec-la-confiance': [
    { id: 'mecl-ev-1', tenantId: 'mec-la-confiance', at: '2024-04-09T08:30:00.000Z', kind: TenantEventKind.Created, summary: 'Banque créée · invitation admin acceptée' },
    { id: 'mecl-ev-2', tenantId: 'mec-la-confiance', at: '2026-03-02T09:00:00.000Z', kind: TenantEventKind.PlanChanged, summary: 'Passage Croissance → Élite' },
    { id: 'mecl-ev-3', tenantId: 'mec-la-confiance', at: '2026-06-12T09:00:00.000Z', kind: TenantEventKind.InvoicePaid, summary: 'Paiement reçu · 180 000 FCFA' },
  ],
  'camccul-express': [
    { id: 'ce-ev-1', tenantId: 'camccul-express', at: '2024-01-15T08:30:00.000Z', kind: TenantEventKind.Created, summary: 'Banque créée · invitation admin acceptée' },
    { id: 'ce-ev-2', tenantId: 'camccul-express', at: '2026-06-15T09:00:00.000Z', kind: TenantEventKind.InvoicePaid, summary: 'Paiement reçu · 180 000 FCFA' },
  ],
  'la-regionale-mf': [
    { id: 'lr-ev-1', tenantId: 'la-regionale-mf', at: '2024-09-10T08:30:00.000Z', kind: TenantEventKind.Created, summary: 'Banque créée · invitation admin acceptée' },
    { id: 'lr-ev-2', tenantId: 'la-regionale-mf', at: '2026-06-10T09:00:00.000Z', kind: TenantEventKind.InvoicePaid, summary: 'Paiement reçu · 120 000 FCFA' },
  ],
  'financia-mf': [
    { id: 'fm-ev-1', tenantId: 'financia-mf', at: '2024-11-20T08:30:00.000Z', kind: TenantEventKind.Created, summary: 'Banque créée · invitation admin acceptée' },
    { id: 'fm-ev-2', tenantId: 'financia-mf', at: '2026-06-20T09:00:00.000Z', kind: TenantEventKind.InvoicePaid, summary: 'Paiement reçu · 120 000 FCFA' },
  ],
  'mutuelle-espoir-douala': [
    { id: 'me-ev-1', tenantId: 'mutuelle-espoir-douala', at: daysAgo(27), kind: TenantEventKind.Created, summary: 'Banque créée · période d’essai démarrée' },
  ],
  'coopec-sahel': [
    { id: 'cs-ev-1', tenantId: 'coopec-sahel', at: '2024-11-14T08:30:00.000Z', kind: TenantEventKind.Created, summary: 'Banque créée · plan Croissance' },
    { id: 'cs-ev-2', tenantId: 'coopec-sahel', at: daysAgo(43), kind: TenantEventKind.InvoicePaid, summary: 'Paiement reçu · 120 000 FCFA' },
  ],
  'alliance-populaire': [
    { id: 'ap-ev-1', tenantId: 'alliance-populaire', at: '2025-03-10T08:30:00.000Z', kind: TenantEventKind.Created, summary: 'Banque créée · plan Essentiel' },
    { id: 'ap-ev-2', tenantId: 'alliance-populaire', at: daysAgo(120), kind: TenantEventKind.Suspended, summary: 'Banque suspendue par S. Etoa' },
  ],
  'union-financiere-ouest': [
    { id: 'ufo-ev-1', tenantId: 'union-financiere-ouest', at: daysAgo(1), kind: TenantEventKind.Created, summary: "Banque créée · invitation envoyée à l'admin" },
  ],
};
