import { AGENTS_ROSTER } from '@/config/fixtures/AgentsRosterFixture';
import type { CollectionGateway } from '../../application/ports/CollectionGateway';
import type { FetchRoundDetailResponse } from '../../application/usecases/fetch-round-detail-async/FetchRoundDetailResponse';
import type { FetchRoundsResponse } from '../../application/usecases/fetch-rounds-async/FetchRoundsResponse';
import { RoundStatus, type CollectionRound, type PartialDeposit } from '../../domain/entities/CollectionRound';
import { RoundStopStatus, type RoundStop } from '../../domain/entities/RoundStop';

const TODAY = new Date().toISOString().slice(0, 10);

const FILLER_FIRST_NAMES = [
  'Marie', 'André', 'Clémence', 'Emmanuel', 'Ariane', 'Blaise', 'Nadège', 'Florence',
  'Patrice', 'Solange', 'Bertrand', 'Huguette', 'Cyrille', 'Delphine', 'Gaston', 'Irène',
  'Junior', 'Léa', 'Martial', 'Odile',
];
const FILLER_LAST_NAMES = [
  'Mbida', 'Fouda', 'Essomba', 'Nkolo', 'Owona', 'Tchana', 'Abega', 'Meka', 'Ella', 'Zang',
  'Bilo', 'Mendo', 'Sende', 'Amougou', 'Onana', 'Ekwalla', 'Talla',
];
const FILLER_ACTIVITIES = [
  'Vendeuse de légumes', 'Tailleur', 'Menuisier', 'Restauratrice', 'Mécanicien',
  'Épicière', 'Cordonnier', 'Photographe', 'Boulanger', 'Coiffeuse', 'Maçon', 'Couturière',
];

/** Génère des stops de remplissage plausibles pour compléter les compteurs d'une tournée. */
const generateFillerStops = (
  roundId: string,
  zone: string,
  seedOffset: number,
  collectedCount: number,
  otherStatuses: RoundStop['status'][],
): RoundStop[] => {
  const stops: RoundStop[] = [];
  let minutesFromMidnight = 8 * 60 + 30;

  const pickName = (index: number): string => {
    const first = FILLER_FIRST_NAMES[(index + seedOffset) % FILLER_FIRST_NAMES.length];
    const last = FILLER_LAST_NAMES[(index * 3 + seedOffset) % FILLER_LAST_NAMES.length];
    return `${first} ${last}`;
  };
  const pickActivity = (index: number): string =>
    FILLER_ACTIVITIES[(index + seedOffset) % FILLER_ACTIVITIES.length];

  for (let i = 0; i < collectedCount; i += 1) {
    minutesFromMidnight += 5 + (i % 4);
    const hh = String(Math.floor(minutesFromMidnight / 60)).padStart(2, '0');
    const mm = String(minutesFromMidnight % 60).padStart(2, '0');
    const name = pickName(i);
    stops.push({
      id: `${roundId}-stop-filler-c-${i}`,
      roundId,
      zone,
      client: { id: `${roundId}-client-filler-c-${i}`, name, activity: pickActivity(i), hasSmartphone: i % 3 !== 0 },
      usualAmount: 1_000 + (i % 5) * 200,
      status: RoundStopStatus.Collected,
      collectedAmount: 1_000 + (i % 5) * 200,
      collectedAt: `${hh}h${mm}`,
    });
  }

  otherStatuses.forEach((status, i) => {
    const name = pickName(collectedCount + i);
    stops.push({
      id: `${roundId}-stop-filler-o-${i}`,
      roundId,
      zone,
      client: {
        id: `${roundId}-client-filler-o-${i}`,
        name,
        activity: pickActivity(collectedCount + i),
        hasSmartphone: i % 2 === 0,
      },
      usualAmount: 1_000 + (i % 4) * 150,
      status,
      note: status === RoundStopStatus.Postponed ? 'Reporté à demain' : undefined,
    });
  });

  return stops;
};

/** Détail complet de la tournée de Cédric — clients exacts des maquettes + tâche. */
const buildCedricStops = (roundId: string): RoundStop[] => {
  const named: RoundStop[] = [
    {
      id: 'stop-cedric-01', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-bernadette-ngo', name: 'Bernadette Ngo', activity: 'Vendeuse de beignets', hasSmartphone: false },
      usualAmount: 1_000, status: RoundStopStatus.Collected, collectedAmount: 1_000, collectedAt: '08h26',
    },
    {
      id: 'stop-cedric-02', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-jean-pierre-etoa', name: 'Jean-Pierre Etoa', activity: 'Quincaillerie', hasSmartphone: true },
      usualAmount: 1_500, status: RoundStopStatus.Collected, collectedAmount: 1_500, collectedAt: '08h41',
    },
    {
      id: 'stop-cedric-03', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-sylvie-mballa', name: 'Sylvie Mballa', activity: 'Couturière', hasSmartphone: true },
      usualAmount: 1_000, status: RoundStopStatus.Collected, collectedAmount: 1_000, collectedAt: '09h35',
    },
    {
      id: 'stop-cedric-04', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-paul-kamga', name: 'Paul Kamga', activity: 'Cordonnier', hasSmartphone: false },
      usualAmount: 1_200, status: RoundStopStatus.Absent,
    },
    {
      id: 'stop-cedric-05', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-henriette-ndlo', name: 'Henriette Ndlo', activity: 'Restauratrice', hasSmartphone: false },
      usualAmount: 1_300, status: RoundStopStatus.Postponed, note: 'Reporté à 15h',
    },
    {
      id: 'stop-cedric-06', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-robert-biya', name: 'Robert Biya', activity: 'Menuisier', hasSmartphone: false },
      usualAmount: 1_100, status: RoundStopStatus.ToVisit,
    },
    {
      id: 'stop-cedric-07', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-alice-fouda', name: 'Alice Fouda', activity: 'Épicière', hasSmartphone: true },
      usualAmount: 1_000, status: RoundStopStatus.ToVisit,
    },
    {
      id: 'stop-cedric-08', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-daniel-manga', name: 'Daniel Manga', activity: 'Photographe', hasSmartphone: true },
      usualAmount: 1_200, status: RoundStopStatus.ToVisit,
    },
    {
      id: 'stop-cedric-09', roundId, zone: 'Marché Mokolo',
      client: { id: 'client-ousmane-njoya', name: 'Ousmane Njoya', activity: 'Call-box', hasSmartphone: false },
      usualAmount: 1_000, status: RoundStopStatus.Postponed, note: 'Reporté',
    },
    // Zone secondaire de la tournée de Cédric (maquette : clients groupés par zone).
    {
      id: 'stop-cedric-10', roundId, zone: 'Carrefour Warda',
      client: { id: 'client-grace-atangana-2', name: 'Grace Atangana', activity: 'Coiffeuse', hasSmartphone: true },
      usualAmount: 1_000, status: RoundStopStatus.ToVisit,
    },
  ];

  // Compte actuel : 3 Cotisé, 2 Reporté, 1 Absent, 4 À visiter (10 stops).
  // Complète jusqu'à 52 au total avec 34 Cotisé au total (34/52 de la maquette).
  const remainingCollected = 34 - 3;
  const filler = generateFillerStops(roundId, 'Marché Mokolo', 1, remainingCollected, [
    ...Array<RoundStop['status']>(7).fill(RoundStopStatus.ToVisit),
    ...Array<RoundStop['status']>(3).fill(RoundStopStatus.Absent),
    RoundStopStatus.Postponed,
  ]);

  return [...named, ...filler];
};

const buildGenericStops = (
  roundId: string,
  zone: string,
  visited: number,
  total: number,
  seedOffset: number,
): RoundStop[] => {
  const remaining = total - visited;
  const otherCount = Math.max(0, remaining);
  const otherStatuses: RoundStop['status'][] = Array.from({ length: otherCount }, (_, i) =>
    i % 4 === 0 ? RoundStopStatus.Absent : RoundStopStatus.ToVisit,
  );
  return generateFillerStops(roundId, zone, seedOffset, visited, otherStatuses);
};

const buildRound = (
  agentId: string,
  status: RoundStatus,
  partialDeposits: PartialDeposit[],
  openDisputesCount: number,
): CollectionRound => {
  const agent = AGENTS_ROSTER.find((entry) => entry.agentId === agentId);
  if (!agent) {
    throw new Error(`Agent introuvable dans le roster : ${agentId}`);
  }
  return {
    id: agentId,
    date: TODAY,
    agent: { id: agent.agentId, name: agent.name },
    zone: agent.zone,
    status,
    progress: { visited: agent.roundProgress.visited, expected: agent.roundProgress.total },
    expectedTotal: 0, // recalculé après génération des stops (buildRoundsAndStops)
    collectedTotal: agent.collectedAmount,
    cashInHand: agent.cashInHand,
    cashHoldingCap: agent.cashHoldingCap,
    partialDeposits,
    openDisputesCount,
    startedAt: agent.startedAt,
    endedAt: agent.endedAt,
  };
};

const buildRoundsAndStops = (): { rounds: CollectionRound[]; stopsByRoundId: Record<string, RoundStop[]> } => {
  const rounds: CollectionRound[] = [
    buildRound('agent-cedric-nkoulou', RoundStatus.Open, [
      { id: 'dep-seed-cedric-01', amount: 15_000, validatedAt: '11h20', validatedBy: 'A. Mbarga' },
    ], 0),
    buildRound('agent-grace-atangana', RoundStatus.Open, [], 1),
    buildRound('agent-ibrahim-sali', RoundStatus.Closed, [
      { id: 'dep-seed-ibrahim-01', amount: 20_000, validatedAt: '11h02', validatedBy: 'A. Mbarga' },
    ], 0),
    buildRound('agent-jean-baptiste-owona', RoundStatus.Closed, [], 0),
    buildRound('agent-rosalie-fotso', RoundStatus.Open, [], 0),
  ];

  const stopsByRoundId: Record<string, RoundStop[]> = {
    'agent-cedric-nkoulou': buildCedricStops('agent-cedric-nkoulou'),
    'agent-grace-atangana': buildGenericStops('agent-grace-atangana', 'Carrefour Warda', 41, 45, 11),
    'agent-ibrahim-sali': buildGenericStops('agent-ibrahim-sali', 'Mvog-Ada', 52, 52, 23),
    'agent-jean-baptiste-owona': buildGenericStops('agent-jean-baptiste-owona', 'Essos', 45, 45, 37),
    'agent-rosalie-fotso': buildGenericStops('agent-rosalie-fotso', 'Marché Mokolo', 28, 40, 43),
  };

  for (const round of rounds) {
    const stops = stopsByRoundId[round.id] ?? [];
    round.expectedTotal = stops.reduce((total, stop) => total + stop.usualAmount, 0);
  }

  return { rounds, stopsByRoundId };
};

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/**
 * Gateway en mémoire — pas de backend. Chiffres partagés avec
 * `FakeDashboardGateway` via `AGENTS_ROSTER`. Latence simulée (300-600ms).
 */
export class FakeCollectionGateway implements CollectionGateway {
  private rounds: CollectionRound[];
  private stopsByRoundId: Record<string, RoundStop[]>;

  constructor() {
    const seed = buildRoundsAndStops();
    this.rounds = seed.rounds;
    this.stopsByRoundId = seed.stopsByRoundId;
  }

  async fetchRounds(_date: string): Promise<FetchRoundsResponse> {
    await delay();
    return { rounds: this.rounds.map((round) => structuredClone(round)) };
  }

  async fetchRoundDetail(roundId: string): Promise<FetchRoundDetailResponse> {
    await delay();
    const round = this.rounds.find((candidate) => candidate.id === roundId);
    if (!round) {
      throw new Error(`Tournée introuvable : ${roundId}`);
    }
    const stops = this.stopsByRoundId[roundId] ?? [];
    return { round: structuredClone(round), stops: structuredClone(stops) };
  }
}
