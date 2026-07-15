import type { SupervisionGateway } from '../../application/ports/SupervisionGateway';
import {
  AttentionSeverity,
  type AgencyBreakdownEntry,
  type AgencyReconciliation,
  type AgentRanking,
  type AttentionPoint,
  type DailyCollectionPoint,
  type SupervisionDaySnapshot,
  type SupervisionMonthSnapshot,
} from '../../domain/entities/Supervision';

/** Mêmes agences/responsables que `zones-agencies` — même histoire racontée dans les deux cartes. */
const seedReconciliations = (): AgencyReconciliation[] => [
  { agencyId: 'agency-mokolo', agencyName: 'Mokolo', amount: 734_000, rate: 100, managerName: 'Antoine Mbarga' },
  { agencyId: 'agency-essos', agencyName: 'Essos', amount: 512_000, rate: 80, managerName: 'Pauline Owona' },
  { agencyId: 'agency-mvog-ada', agencyName: 'Mvog-Ada', amount: 174_000, rate: 100, managerName: 'Serge Biyiha' },
];

/** Mêmes agents que `FakeAgentGateway` — classement cohérent avec la fiche de chacun. */
const seedRanking = (): AgentRanking[] => [
  { agentId: 'agent-grace-atangana', agentName: 'Grace Atangana', agencyName: 'Mokolo', regularityRate: 96, amount: 51_500 },
  { agentId: 'agent-cedric-nkoulou', agentName: 'Cédric Nkoulou', agencyName: 'Mokolo', regularityRate: 94, amount: 48_200 },
  { agentId: 'agent-ibrahim-sali', agentName: 'Ibrahim Sali', agencyName: 'Mvog-Ada', regularityRate: 97, amount: 44_800 },
  { agentId: 'agent-jean-baptiste-owona', agentName: 'Jean-Baptiste Owona', agencyName: 'Essos', regularityRate: 95, amount: 41_100 },
  { agentId: 'agent-rosalie-fotso', agentName: 'Rosalie Fotso', agencyName: 'Mokolo', regularityRate: 89, amount: 38_500 },
];

const seedAttentionPoints = (): AttentionPoint[] => [
  { id: 'attn-reversement-rejete', title: 'Reversement rejeté', description: 'BRD-2026-0703-02 · Grace Atangana · écart non justifié', severity: AttentionSeverity.Danger },
  { id: 'attn-appareil-revoque', title: 'Appareil révoqué', description: 'Rosalie Fotso · à réactiver avant sa prochaine tournée', severity: AttentionSeverity.Warning },
  { id: 'attn-bordereau-attente', title: 'Bordereau en attente', description: 'Jean-Baptiste Owona · non transmis depuis hier', severity: AttentionSeverity.Warning },
];

const seedDaySnapshot = (): SupervisionDaySnapshot => ({
  collectedToday: 1_420_000,
  collectedTodayDeltaPct: 8.2,
  reconciledRate: 96,
  reconciledCount: 15,
  reconciledTotal: 16,
  cashGapAmount: 2_500,
  cashGapRejections: 1,
  reconciliations: seedReconciliations(),
  ranking: seedRanking(),
  attentionPoints: seedAttentionPoints(),
});

/** Série quotidienne de juin — dérivée d'une base + variation déterministe (pas de vrai historique stocké). */
const seedTrend = (): DailyCollectionPoint[] => {
  const base = 1_100_000;
  const wave = [0, 0.08, 0.15, 0.05, -0.05, -0.1, 0.02, 0.12, 0.2, 0.1, 0.0, -0.08, -0.12, 0.04, 0.18, 0.25, 0.15, 0.05, -0.02, -0.1, 0.06, 0.14, 0.22, 0.3, 0.2, 0.1, 0.0, 0.15, 0.35, 0.55];
  return wave.map((factor, index) => ({
    date: `2026-06-${String(index + 1).padStart(2, '0')}`,
    amount: Math.round(base * (1 + factor)),
  }));
};

const seedBreakdown = (): AgencyBreakdownEntry[] => [
  { agencyName: 'Mokolo', amount: 19_400_000, share: 50 },
  { agencyName: 'Essos', amount: 13_900_000, share: 36 },
  { agencyName: 'Mvog-Ada', amount: 5_300_000, share: 14 },
];

const seedTopAgents = (): AgentRanking[] => seedRanking().slice(0, 3);

const seedMonthSnapshot = (): SupervisionMonthSnapshot => {
  const trend = seedTrend();
  return {
    monthLabel: 'Juin 2026',
    collectedMonth: 38_600_000,
    collectedMonthDeltaPct: 12,
    settlementRate: 98.4,
    trend,
    trendAverage: 1_250_000,
    breakdown: seedBreakdown(),
    topAgents: seedTopAgents(),
  };
};

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeSupervisionGateway implements SupervisionGateway {
  private day: SupervisionDaySnapshot = seedDaySnapshot();
  private month: SupervisionMonthSnapshot = seedMonthSnapshot();

  async fetch(): Promise<{ day: SupervisionDaySnapshot; month: SupervisionMonthSnapshot }> {
    await delay();
    return { day: structuredClone(this.day), month: structuredClone(this.month) };
  }
}
