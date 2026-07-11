import { AGENTS_ROSTER } from '@/config/fixtures/AgentsRosterFixture';
import type { DashboardGateway } from '../../application/ports/DashboardGateway';
import type { FetchDaySummaryResponse } from '../../application/usecases/fetch-day-summary-async/FetchDaySummaryResponse';
import { ActivityEventKind, type ActivityEvent } from '../../domain/entities/ActivityEvent';
import { AgentDayStatus, type AgentDaySummary } from '../../domain/entities/AgentDaySummary';

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const hoursAgo = (hours: number): string => new Date(Date.now() - hours * 3_600_000).toISOString();

/**
 * Résumés du jour — chiffres partagés avec `collections` via
 * `AGENTS_ROSTER` (même tournée, mêmes montants des deux côtés) ; seuls le
 * statut dashboard, les contestations et le lien vers le reversement sont
 * propres à ce module.
 */
const seedAgents = (): AgentDaySummary[] =>
  AGENTS_ROSTER.map((agent) => {
    if (agent.agentId === 'agent-ibrahim-sali') {
      return {
        agentId: agent.agentId,
        name: agent.name,
        zone: agent.zone,
        roundProgress: agent.roundProgress,
        collectedAmount: agent.collectedAmount,
        cashInHand: agent.cashInHand,
        cashHoldingCap: agent.cashHoldingCap,
        status: AgentDayStatus.SettlementPending,
        openDisputesCount: 0,
        // Même bordereau que FakeSettlementGateway (module settlements) : le clic
        // "Ouvrir le bordereau" doit atterrir sur un vrai slip existant.
        slipId: 'BRD-2026-0703-01',
        settlementPendingSince: hoursAgo(2.17),
      };
    }
    if (agent.agentId === 'agent-jean-baptiste-owona') {
      return {
        agentId: agent.agentId,
        name: agent.name,
        zone: agent.zone,
        roundProgress: agent.roundProgress,
        collectedAmount: agent.collectedAmount,
        cashInHand: agent.cashInHand,
        cashHoldingCap: agent.cashHoldingCap,
        status: AgentDayStatus.Validated,
        openDisputesCount: 0,
        slipId: null,
        settlementPendingSince: null,
      };
    }
    return {
      agentId: agent.agentId,
      name: agent.name,
      zone: agent.zone,
      roundProgress: agent.roundProgress,
      collectedAmount: agent.collectedAmount,
      cashInHand: agent.cashInHand,
      cashHoldingCap: agent.cashHoldingCap,
      status: AgentDayStatus.OnRound,
      openDisputesCount: agent.agentId === 'agent-grace-atangana' ? 1 : 0,
      slipId: null,
      settlementPendingSince: null,
    };
  });

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
