import type { DashboardGateway } from '../../application/ports/DashboardGateway';
import type { FetchDaySummaryResponse } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryResponse';
import { ActivityEventKind, type ActivityEvent } from '../../domain/entities/ActivityEvent';
import { AgentDayStatus, type AgentDaySummary } from '../../domain/entities/AgentDaySummary';

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const hoursAgo = (hours: number): string => new Date(Date.now() - hours * 3_600_000).toISOString();

/** Résumés du jour — données exactes de la maquette 1a (5 des 10 agents). */
const seedAgents = (): AgentDaySummary[] => [
  {
    agentId: 'agent-cedric-nkoulou',
    name: 'Cédric Nkoulou',
    zone: 'Marché Mokolo',
    roundProgress: { visited: 34, total: 52 },
    collectedAmount: 34_200,
    cashInHand: 85_000,
    cashHoldingCap: 100_000,
    status: AgentDayStatus.OnRound,
    openDisputesCount: 0,
    slipId: null,
    settlementPendingSince: null,
  },
  {
    agentId: 'agent-grace-atangana',
    name: 'Grace Atangana',
    zone: 'Carrefour Warda',
    roundProgress: { visited: 41, total: 45 },
    collectedAmount: 39_500,
    cashInHand: 52_000,
    cashHoldingCap: 100_000,
    status: AgentDayStatus.OnRound,
    openDisputesCount: 1,
    slipId: null,
    settlementPendingSince: null,
  },
  {
    // Même bordereau que FakeSettlementGateway (module settlements) : le clic
    // "Ouvrir le bordereau" doit atterrir sur un vrai slip existant.
    agentId: 'agent-ibrahim-sali',
    name: 'Ibrahim Sali',
    zone: 'Mvog-Ada',
    roundProgress: { visited: 52, total: 52 },
    collectedAmount: 44_500,
    cashInHand: 44_500,
    cashHoldingCap: 100_000,
    status: AgentDayStatus.SettlementPending,
    openDisputesCount: 0,
    slipId: 'BRD-2026-0703-01',
    settlementPendingSince: hoursAgo(2.17),
  },
  {
    agentId: 'agent-jean-baptiste-owona',
    name: 'Jean-Baptiste Owona',
    zone: 'Essos',
    roundProgress: { visited: 45, total: 45 },
    collectedAmount: 47_000,
    cashInHand: 0,
    cashHoldingCap: 100_000,
    status: AgentDayStatus.Validated,
    openDisputesCount: 0,
    slipId: null,
    settlementPendingSince: null,
  },
  {
    agentId: 'agent-rosalie-fotso',
    name: 'Rosalie Fotso',
    zone: 'Marché Mokolo',
    roundProgress: { visited: 28, total: 40 },
    collectedAmount: 21_000,
    cashInHand: 61_000,
    cashHoldingCap: 100_000,
    status: AgentDayStatus.OnRound,
    openDisputesCount: 0,
    slipId: null,
    settlementPendingSince: null,
  },
];

/** Fil d'activité — événements exacts de la maquette 1a, horodatés en relatif. */
const seedActivity = (): ActivityEvent[] => [
  {
    id: 'evt-seed-01',
    occurredAt: minutesAgo(2),
    kind: ActivityEventKind.CollectionConfirmed,
    message: 'Cédric N. a collecté 1 000 FCFA chez Bernadette Ngo',
    agentId: 'agent-cedric-nkoulou',
  },
  {
    id: 'evt-seed-02',
    occurredAt: minutesAgo(6),
    kind: ActivityEventKind.DisputeOpened,
    message: 'Contestation ouverte — Grace A. : le client conteste 500 FCFA',
    agentId: 'agent-grace-atangana',
  },
  {
    id: 'evt-seed-03',
    occurredAt: minutesAgo(19),
    kind: ActivityEventKind.DayClosed,
    message: "Ibrahim S. a clôturé sa journée — reversement 44 500 FCFA en attente",
    agentId: 'agent-ibrahim-sali',
  },
  {
    id: 'evt-seed-04',
    occurredAt: minutesAgo(36),
    kind: ActivityEventKind.SettlementValidated,
    message: 'Jean-Baptiste O. — reversement validé, quittance émise',
    agentId: 'agent-jean-baptiste-owona',
  },
  {
    id: 'evt-seed-05',
    occurredAt: minutesAgo(54),
    kind: ActivityEventKind.CapApproaching,
    message: 'Rosalie F. cash en main proche du plafond (61 000)',
    agentId: 'agent-rosalie-fotso',
  },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeDashboardGateway implements DashboardGateway {
  private agents: AgentDaySummary[] = seedAgents();
  private activity: ActivityEvent[] = seedActivity();

  async fetchDaySummary(): Promise<FetchDaySummaryResponse> {
    await delay();
    return {
      agents: structuredClone(this.agents),
      activity: structuredClone(this.activity),
    };
  }
}
