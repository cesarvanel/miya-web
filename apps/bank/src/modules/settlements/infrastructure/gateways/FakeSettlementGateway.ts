import type { FetchSettlementQueueResponse } from '../../application/usecases/fetch-settlement-queue-async/FetchSettlementQueueResponse';
import type { FetchSlipResponse } from '../../application/usecases/fetch-slip-async/FetchSlipResponse';
import type { ValidateSettlementResponse } from '../../application/usecases/validate-settlement-async/ValidateSettlementResponse';
import type {
  RejectSettlementInput,
  SettlementGateway,
} from '../../application/ports/SettlementGateway';
import {
  SettlementKind,
  SettlementLineStatus,
  SettlementStatus,
  type SettlementSlip,
} from '../../domain/entities/SettlementSlip';

/**
 * Reste du portefeuille d'Ibrahim (44 cotisé / 3 supplément / 5 absent au
 * total, comme sur la maquette 2a) — au-delà des 5 premières lignes
 * affichées d'emblée, pour donner un sens réel à « Afficher les lignes
 * restantes » dans le détail par client.
 */
const generateIbrahimRemainingLines = (): SettlementSlip['lines'] => {
  const firstNames = ['Marie', 'André', 'Clémence', 'Emmanuel', 'Ariane', 'Blaise', 'Nadège', 'Florence', 'Patrice', 'Solange', 'Bertrand', 'Huguette', 'Cyrille', 'Delphine', 'Gaston', 'Irène', 'Junior', 'Léa'];
  const lastNames = ['Mbida', 'Fouda', 'Essomba', 'Nkolo', 'Owona', 'Tchana', 'Abega', 'Meka', 'Ella', 'Zang', 'Bilo', 'Mendo', 'Sende', 'Amougou', 'Onana', 'Ekwalla', 'Talla'];

  const statuses: SettlementLineStatus[] = [
    ...Array<SettlementLineStatus>(4).fill(SettlementLineStatus.Absent),
    ...Array<SettlementLineStatus>(2).fill(SettlementLineStatus.Extra),
    ...Array<SettlementLineStatus>(41).fill(SettlementLineStatus.Collected),
  ];

  let minutesFromMidnight = 9 * 60 + 42; // reprend juste après Sylvie (09h35)

  return statuses.map((status, index) => {
    minutesFromMidnight += 6;
    const hh = String(Math.floor(minutesFromMidnight / 60)).padStart(2, '0');
    const mm = String(minutesFromMidnight % 60).padStart(2, '0');
    const isAbsent = status === SettlementLineStatus.Absent;
    return {
      clientId: `c-${String(index + 6).padStart(2, '0')}`,
      clientName: `${firstNames[index % firstNames.length]} ${lastNames[(index * 3 + 5) % lastNames.length]}`,
      collectedAt: isAbsent ? null : `${hh}h${mm}`,
      amount: isAbsent ? 0 : status === SettlementLineStatus.Extra ? 1_500 : 1_000,
      status,
    };
  });
};

/** Bordereaux de la file du soir (2a) + demande de dépôt partiel (2d) — données exactes des maquettes. */
const seedSlips = (): SettlementSlip[] => [
  {
    id: 'BRD-2026-0703-01',
    kind: SettlementKind.Settlement,
    slipNumber: 'BRD-2026-0703-01',
    agentId: 'agent-ibrahim-sali',
    agentName: 'Ibrahim Sali',
    zone: 'Mvog-Ada',
    clientCount: 52,
    closedAt: '12h05',
    expectedAmount: 44_500,
    status: SettlementStatus.PendingValidation,
    lines: [
      { clientId: 'c-01', clientName: 'Bernadette Ngo', collectedAt: '08h26', amount: 1_000, status: SettlementLineStatus.Collected },
      { clientId: 'c-02', clientName: 'Jean-Pierre Etoa', collectedAt: '08h41', amount: 1_500, status: SettlementLineStatus.Collected },
      { clientId: 'c-03', clientName: 'Marthe Tchoumi', collectedAt: '09h03', amount: 2_000, status: SettlementLineStatus.Extra },
      { clientId: 'c-04', clientName: 'Paul Kamga', collectedAt: null, amount: 0, status: SettlementLineStatus.Absent },
      { clientId: 'c-05', clientName: 'Sylvie Mballa', collectedAt: '09h35', amount: 1_000, status: SettlementLineStatus.Collected },
      ...generateIbrahimRemainingLines(),
    ],
    partialDeposits: [{ amount: 20_000, validatedAt: '11h02' }],
    partialDepositContext: null,
    rejection: null,
  },
  {
    id: 'BRD-2026-0703-02',
    kind: SettlementKind.Settlement,
    slipNumber: 'BRD-2026-0703-02',
    agentId: 'agent-grace-atangana',
    agentName: 'Grace Atangana',
    zone: 'Carr. Warda',
    clientCount: 38,
    closedAt: '12h18',
    expectedAmount: 39_000,
    status: SettlementStatus.PendingValidation,
    lines: [
      { clientId: 'c-06', clientName: 'Sévérin Onana', collectedAt: '09h50', amount: 3_000, status: SettlementLineStatus.Collected },
      { clientId: 'c-07', clientName: 'Alphonsine Ndongo', collectedAt: '10h05', amount: 2_500, status: SettlementLineStatus.Collected },
      { clientId: 'c-08', clientName: 'Béatrice Eyenga', collectedAt: '10h15', amount: 4_500, status: SettlementLineStatus.Disputed },
    ],
    partialDeposits: [],
    partialDepositContext: null,
    rejection: null,
  },
  {
    id: 'BRD-2026-0703-03',
    kind: SettlementKind.Settlement,
    slipNumber: 'BRD-2026-0703-03',
    agentId: 'agent-rosalie-fotso',
    agentName: 'Rosalie Fotso',
    zone: 'Mokolo',
    clientCount: 40,
    closedAt: '12h30',
    expectedAmount: 31_500,
    status: SettlementStatus.PendingValidation,
    lines: [
      { clientId: 'c-09', clientName: 'Odette Mballa', collectedAt: '08h50', amount: 1_500, status: SettlementLineStatus.Collected },
      { clientId: 'c-10', clientName: 'Vincent Abega', collectedAt: '09h10', amount: 2_000, status: SettlementLineStatus.Collected },
    ],
    partialDeposits: [],
    partialDepositContext: null,
    rejection: null,
  },
  {
    id: 'BRD-2026-0703-04',
    kind: SettlementKind.Settlement,
    slipNumber: 'BRD-2026-0703-04',
    agentId: 'agent-aicha-bakari',
    agentName: 'Aïcha Bakari',
    zone: 'Briqueterie',
    clientCount: 30,
    closedAt: '12h42',
    expectedAmount: 28_000,
    status: SettlementStatus.PendingValidation,
    lines: [
      { clientId: 'c-11', clientName: 'Fatima Njoya', collectedAt: '08h30', amount: 1_000, status: SettlementLineStatus.Collected },
      { clientId: 'c-12', clientName: 'Hamidou Sali', collectedAt: '08h55', amount: 1_500, status: SettlementLineStatus.Extra },
    ],
    partialDeposits: [],
    partialDepositContext: null,
    rejection: null,
  },
  {
    id: 'DEP-2026-0703-07',
    kind: SettlementKind.PartialDeposit,
    slipNumber: 'DEP-2026-0703-07',
    agentId: 'agent-cedric-nkoulou',
    agentName: 'Cédric Nkoulou',
    zone: 'Marché Mokolo',
    clientCount: 52,
    closedAt: null,
    expectedAmount: 60_000,
    status: SettlementStatus.PendingValidation,
    lines: [],
    partialDeposits: [],
    partialDepositContext: {
      cashOnHand: 85_000,
      ceiling: 100_000,
      tourProgressPercent: 65,
      visitedClients: 34,
      collectedSoFar: 34_200,
      remainingClients: 18,
    },
    rejection: null,
  },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

const clone = (slip: SettlementSlip): SettlementSlip => structuredClone(slip);

/**
 * Gateway en mémoire — pas de backend. Latence simulée (300-600ms) pour
 * exercer les skeletons ; les mutations (validate/reject) modifient l'état
 * interne, si bien qu'un refetch reflète la décision prise.
 */
export class FakeSettlementGateway implements SettlementGateway {
  private slips: SettlementSlip[] = seedSlips();
  private receiptSeq = 13;

  async fetchQueue(): Promise<FetchSettlementQueueResponse> {
    await delay();
    return { settlements: this.slips.map(clone) };
  }

  async fetchSlip(id: string): Promise<FetchSlipResponse> {
    await delay();
    const slip = this.slips.find((candidate) => candidate.id === id);
    if (!slip) {
      throw new Error(`Bordereau introuvable : ${id}`);
    }
    return { settlement: clone(slip) };
  }

  async validate(id: string): Promise<ValidateSettlementResponse> {
    await delay();
    const slip = this.slips.find((candidate) => candidate.id === id);
    if (!slip) {
      throw new Error(`Bordereau introuvable : ${id}`);
    }
    slip.status = SettlementStatus.Validated;
    this.receiptSeq += 1;
    return { receiptNumber: `QT-0703-0${this.receiptSeq}` };
  }

  async reject(id: string, input: RejectSettlementInput): Promise<void> {
    await delay();
    const slip = this.slips.find((candidate) => candidate.id === id);
    if (!slip) {
      throw new Error(`Bordereau introuvable : ${id}`);
    }
    slip.status = SettlementStatus.Rejected;
    slip.rejection = { reason: input.reason, receivedAmount: input.receivedAmount };
  }
}
