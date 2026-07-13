import type { DisburseWithdrawalInput, WithdrawalGateway } from '../../application/ports/WithdrawalGateway';
import type { FetchWithdrawalsResponse } from '../../application/usecases/fetch-withdrawals-async/FetchWithdrawalsResponse';
import { DisbursementMethod, WithdrawalStatus, type Withdrawal } from '../../domain/entities/Withdrawal';

const daysAgo = (days: number, hour = 9, minute = 0): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, minute, 0, 0);
  return date.toISOString();
};

/**
 * Demandes reprises avec les MÊMES ids clients que `FakeClientGateway` — la
 * demande de Bernadette Ngo est EXACTEMENT celle du bandeau de sa fiche
 * client (15 000 FCFA, déposée hier) ; Christine Eyenga et Emmanuel Bila
 * reprennent aussi leur `pendingWithdrawal` déjà présent sur leur fiche.
 */
const seedWithdrawals = (): Withdrawal[] => [
  {
    id: 'WD-0703-12',
    client: { id: 'client-bernadette-ngo', name: 'Bernadette Ngo', activity: 'Vendeuse de beignets' },
    requestedAmount: 15_000,
    availableBalance: 43_500,
    requestedAt: daysAgo(1, 9, 15),
    status: WithdrawalStatus.Pending,
    approval: null,
    disbursement: null,
    rejection: null,
  },
  {
    id: 'WD-0703-08',
    client: { id: 'client-emmanuel-bila', name: 'Emmanuel Bila', activity: 'Menuiserie' },
    requestedAmount: 20_000,
    availableBalance: 54_000,
    requestedAt: daysAgo(2, 10, 0),
    status: WithdrawalStatus.Pending,
    approval: null,
    disbursement: null,
    rejection: null,
  },
  {
    id: 'WD-0703-14',
    client: { id: 'client-christine-eyenga', name: 'Christine Eyenga', activity: 'Commerçante · Pagnes' },
    requestedAmount: 50_000,
    availableBalance: 128_500,
    requestedAt: daysAgo(0, 9, 0),
    status: WithdrawalStatus.Approved,
    approval: { by: 'A. Mbarga', at: daysAgo(0, 14, 58) },
    disbursement: null,
    rejection: null,
  },
  {
    id: 'WD-0628-05',
    client: { id: 'client-jean-pierre-etoa', name: 'Jean-Pierre Etoa', activity: 'Quincaillerie' },
    requestedAmount: 30_000,
    availableBalance: 67_000,
    requestedAt: daysAgo(6, 11, 20),
    status: WithdrawalStatus.Rejected,
    approval: null,
    disbursement: null,
    rejection: {
      by: 'A. Mbarga',
      at: daysAgo(6, 15, 40),
      reason: 'Photocopie de la CNI illisible — à représenter avec un document lisible.',
    },
  },
  {
    id: 'WD-0625-02',
    client: { id: 'client-sylvie-mballa', name: 'Sylvie Mballa', activity: 'Épicerie' },
    requestedAmount: 10_000,
    availableBalance: 31_000,
    requestedAt: daysAgo(9, 8, 30),
    status: WithdrawalStatus.Disbursed,
    approval: { by: 'A. Mbarga', at: daysAgo(9, 12, 10) },
    disbursement: { by: 'A. Mbarga', at: daysAgo(9, 16, 5), method: DisbursementMethod.CashAtBranch },
    rejection: null,
  },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeWithdrawalGateway implements WithdrawalGateway {
  private withdrawals: Withdrawal[] = seedWithdrawals();

  async fetchAll(): Promise<FetchWithdrawalsResponse> {
    await delay();
    return { withdrawals: this.withdrawals.map((withdrawal) => structuredClone(withdrawal)) };
  }

  async approve(id: string): Promise<void> {
    await delay();
    const withdrawal = this.withdrawals.find((candidate) => candidate.id === id);
    if (!withdrawal) {
      throw new Error(`Demande introuvable : ${id}`);
    }
    withdrawal.status = WithdrawalStatus.Approved;
    withdrawal.approval = { by: 'A. Mbarga', at: new Date().toISOString() };
  }

  async reject(id: string, reason: string): Promise<void> {
    await delay();
    const withdrawal = this.withdrawals.find((candidate) => candidate.id === id);
    if (!withdrawal) {
      throw new Error(`Demande introuvable : ${id}`);
    }
    withdrawal.status = WithdrawalStatus.Rejected;
    withdrawal.rejection = { by: 'A. Mbarga', at: new Date().toISOString(), reason };
  }

  async disburse(command: DisburseWithdrawalInput): Promise<void> {
    await delay();
    const withdrawal = this.withdrawals.find((candidate) => candidate.id === command.withdrawalId);
    if (!withdrawal) {
      throw new Error(`Demande introuvable : ${command.withdrawalId}`);
    }
    withdrawal.status = WithdrawalStatus.Disbursed;
    withdrawal.disbursement = {
      by: 'A. Mbarga',
      at: new Date().toISOString(),
      method: command.method,
      agentId: command.agentId,
    };
  }
}
