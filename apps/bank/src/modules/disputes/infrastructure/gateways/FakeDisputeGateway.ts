import type { DisputeGateway, ResolveDisputeInput } from '../../application/ports/DisputeGateway';
import type { FetchDisputesResponse } from '../../application/usecases/fetch-disputes-async/FetchDisputesResponse';
import { DisputeStatus, type Dispute } from '../../domain/entities/Dispute';

const minutesAgo = (minutes: number): string =>
  new Date(Date.now() - minutes * 60_000).toISOString();

const hoursAgo = (hours: number): string => new Date(Date.now() - hours * 3_600_000).toISOString();

/**
 * Contestations du jour — données exactes de la maquette pour CT-0703-07
 * (Grace Atangana / Christine Eyenga), cohérentes avec le seed dashboard
 * (« Grace A. a 1 contestation ») et settlements (BRD-2026-0703-02, même
 * agent, doit être bloqué à la validation). Les 2 autres dossiers utilisent
 * des agents hors du seed dashboard (5 des 10 agents) pour ne pas fausser
 * leurs compteurs par agent.
 */
const seedDisputes = (): Dispute[] => [
  {
    id: 'CT-0703-07',
    openedAt: minutesAgo(6),
    zone: 'Carrefour Warda',
    status: DisputeStatus.Open,
    agent: { id: 'agent-grace-atangana', name: 'Grace Atangana', enteredAmount: 500 },
    client: { id: 'client-christine-eyenga', name: 'Christine Eyenga', declaredAmount: 1_000 },
    clientHistory: { regularity: { onTime: 29, total: 30 }, disputesLast12Months: 0, clientSince: '2022' },
    agentHistory: { confirmationRate: 98.4, disputesLast12Months: 3, settlementGaps: 1 },
    resolution: null,
  },
  {
    id: 'CT-0703-06',
    openedAt: hoursAgo(2.3),
    zone: 'Nkolbisson',
    status: DisputeStatus.Open,
    agent: { id: 'agent-innocent-ateba', name: 'Innocent Ateba', enteredAmount: 700 },
    client: { id: 'client-fabrice-ondoa', name: 'Fabrice Ondoa', declaredAmount: 1_200 },
    clientHistory: { regularity: { onTime: 18, total: 20 }, disputesLast12Months: 1, clientSince: '2024' },
    agentHistory: { confirmationRate: 95.2, disputesLast12Months: 2, settlementGaps: 0 },
    resolution: null,
  },
  {
    id: 'CT-0703-04',
    openedAt: hoursAgo(4.3),
    zone: 'Etoudi',
    status: DisputeStatus.Resolved,
    agent: { id: 'agent-marie-ela', name: 'Marie Ela', enteredAmount: 2_000 },
    client: { id: 'client-paul-essomba', name: 'Paul Essomba', declaredAmount: 2_500 },
    clientHistory: { regularity: { onTime: 25, total: 28 }, disputesLast12Months: 2, clientSince: '2021' },
    agentHistory: { confirmationRate: 97.1, disputesLast12Months: 1, settlementGaps: 0 },
    resolution: {
      decidedInFavorOf: 'Agent',
      reason: 'Vérification téléphone : la cliente confirme avoir mal lu son solde SMS.',
      decidedBy: 'A. Mbarga',
      decidedAt: hoursAgo(3.2),
    },
  },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeDisputeGateway implements DisputeGateway {
  private disputes: Dispute[] = seedDisputes();

  async fetchAll(): Promise<FetchDisputesResponse> {
    await delay();
    return { disputes: structuredClone(this.disputes) };
  }

  async resolve(input: ResolveDisputeInput): Promise<void> {
    await delay();
    const dispute = this.disputes.find((candidate) => candidate.id === input.disputeId);
    if (!dispute) {
      throw new Error(`Contestation introuvable : ${input.disputeId}`);
    }
    dispute.status = DisputeStatus.Resolved;
    dispute.resolution = {
      decidedInFavorOf: input.inFavorOf,
      reason: input.reason,
      decidedBy: input.decidedBy,
      decidedAt: new Date().toISOString(),
    };
  }
}
