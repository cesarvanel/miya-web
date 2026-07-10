import type {
  RejectSettlementInput,
  SettlementGateway,
  ValidateSettlementResult,
} from '../../application/ports/SettlementGateway';
import type { SettlementSlip } from '../../domain/entities/SettlementSlip';

/** Bordereaux de la file du soir — données exactes de la maquette 2a. */
const seedSlips = (): SettlementSlip[] => [
  {
    id: 'BRD-2026-0703-01',
    slipNumber: 'BRD-2026-0703-01',
    agentId: 'agent-ibrahim-sali',
    agentName: 'Ibrahim Sali',
    zone: 'Mvog-Ada',
    clientCount: 52,
    closedAt: '12h05',
    expectedAmount: 44_500,
    status: 'PendingValidation',
    lines: [
      { clientId: 'c-01', clientName: 'Bernadette Ngo', collectedAt: '08h26', amount: 1_000, status: 'collected' },
      { clientId: 'c-02', clientName: 'Jean-Pierre Etoa', collectedAt: '08h41', amount: 1_500, status: 'collected' },
      { clientId: 'c-03', clientName: 'Marthe Tchoumi', collectedAt: '09h03', amount: 2_000, status: 'extra' },
      { clientId: 'c-04', clientName: 'Paul Kamga', collectedAt: null, amount: 0, status: 'absent' },
      { clientId: 'c-05', clientName: 'Sylvie Mballa', collectedAt: '09h35', amount: 1_000, status: 'collected' },
    ],
    partialDeposits: [{ amount: 20_000, validatedAt: '11h02' }],
    rejection: null,
  },
  {
    id: 'BRD-2026-0703-02',
    slipNumber: 'BRD-2026-0703-02',
    agentId: 'agent-grace-atangana',
    agentName: 'Grace Atangana',
    zone: 'Carr. Warda',
    clientCount: 38,
    closedAt: '12h18',
    expectedAmount: 39_000,
    status: 'PendingValidation',
    lines: [
      { clientId: 'c-06', clientName: 'Sévérin Onana', collectedAt: '09h50', amount: 3_000, status: 'collected' },
      { clientId: 'c-07', clientName: 'Alphonsine Ndongo', collectedAt: '10h05', amount: 2_500, status: 'collected' },
      { clientId: 'c-08', clientName: 'Béatrice Eyenga', collectedAt: '10h15', amount: 4_500, status: 'disputed' },
    ],
    partialDeposits: [],
    rejection: null,
  },
  {
    id: 'BRD-2026-0703-03',
    slipNumber: 'BRD-2026-0703-03',
    agentId: 'agent-rosalie-fotso',
    agentName: 'Rosalie Fotso',
    zone: 'Mokolo',
    clientCount: 40,
    closedAt: '12h30',
    expectedAmount: 31_500,
    status: 'PendingValidation',
    lines: [
      { clientId: 'c-09', clientName: 'Odette Mballa', collectedAt: '08h50', amount: 1_500, status: 'collected' },
      { clientId: 'c-10', clientName: 'Vincent Abega', collectedAt: '09h10', amount: 2_000, status: 'collected' },
    ],
    partialDeposits: [],
    rejection: null,
  },
  {
    id: 'BRD-2026-0703-04',
    slipNumber: 'BRD-2026-0703-04',
    agentId: 'agent-aicha-bakari',
    agentName: 'Aïcha Bakari',
    zone: 'Briqueterie',
    clientCount: 30,
    closedAt: '12h42',
    expectedAmount: 28_000,
    status: 'PendingValidation',
    lines: [
      { clientId: 'c-11', clientName: 'Fatima Njoya', collectedAt: '08h30', amount: 1_000, status: 'collected' },
      { clientId: 'c-12', clientName: 'Hamidou Sali', collectedAt: '08h55', amount: 1_500, status: 'extra' },
    ],
    partialDeposits: [],
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

  async fetchQueue(): Promise<SettlementSlip[]> {
    await delay();
    return this.slips.map(clone);
  }

  async fetchSlip(id: string): Promise<SettlementSlip> {
    await delay();
    const slip = this.slips.find((candidate) => candidate.id === id);
    if (!slip) {
      throw new Error(`Bordereau introuvable : ${id}`);
    }
    return clone(slip);
  }

  async validate(id: string): Promise<ValidateSettlementResult> {
    await delay();
    const slip = this.slips.find((candidate) => candidate.id === id);
    if (!slip) {
      throw new Error(`Bordereau introuvable : ${id}`);
    }
    slip.status = 'Validated';
    this.receiptSeq += 1;
    return { receiptNumber: `QT-0703-0${this.receiptSeq}` };
  }

  async reject(id: string, input: RejectSettlementInput): Promise<void> {
    await delay();
    const slip = this.slips.find((candidate) => candidate.id === id);
    if (!slip) {
      throw new Error(`Bordereau introuvable : ${id}`);
    }
    slip.status = 'Rejected';
    slip.rejection = { reason: input.reason, receivedAmount: input.receivedAmount };
  }
}
