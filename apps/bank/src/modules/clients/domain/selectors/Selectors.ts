import { createSelector } from '@reduxjs/toolkit';
import type { BankRootState } from '@/config/stores/store';
import { ClientsAdapter, type Client } from '../entities/Client';
import { OperationsAdapter, type ClientOperation } from '../entities/ClientOperation';

const clientsAdapterSelectors = ClientsAdapter.getSelectors(
  (state: BankRootState) => state.clients.clients,
);
const operationsAdapterSelectors = OperationsAdapter.getSelectors(
  (state: BankRootState) => state.clients.operations,
);

export const selectAllClients = clientsAdapterSelectors.selectAll;

export const selectClientById = (
  state: BankRootState,
  id: string,
): Client | undefined => clientsAdapterSelectors.selectById(state, id);

export const LOW_REGULARITY_RATIO = 0.8;

const regularityRatio = (client: Client): number =>
  client.regularity.expected === 0 ? 1 : client.regularity.contributed / client.regularity.expected;

export interface ClientsListFilters {
  /** Recherche libre — nom ou téléphone. */
  search?: string;
  zone?: string;
  agentId?: string;
  /** Ne garder que les clients en-dessous de LOW_REGULARITY_RATIO. */
  lowRegularityOnly?: boolean;
}

/** Sélecteur composable — filtres combinables, tous optionnels. */
export const selectClientsList = createSelector(
  [selectAllClients, (_state: BankRootState, filters: ClientsListFilters = {}) => filters],
  (clients, filters) => {
    const search = filters.search?.trim().toLowerCase();
    return clients.filter((client) => {
      if (search) {
        const matchesName = client.fullName.toLowerCase().includes(search);
        const searchDigits = search.replace(/\D/g, '');
        const matchesPhone = searchDigits !== '' && client.phone.includes(searchDigits);
        if (!matchesName && !matchesPhone) {
          return false;
        }
      }
      if (filters.zone && client.zone !== filters.zone) {
        return false;
      }
      if (filters.agentId && client.assignedAgent.id !== filters.agentId) {
        return false;
      }
      if (filters.lowRegularityOnly && regularityRatio(client) >= LOW_REGULARITY_RATIO) {
        return false;
      }
      return true;
    });
  },
);

export const selectClientsCount = createSelector([selectAllClients], (clients) => clients.length);

export const selectTotalActiveClientsLabel = (state: BankRootState): number =>
  state.clients.totalActiveClientsLabel ?? state.clients.clients.ids.length;

export const selectLowRegularityCount = createSelector([selectAllClients], (clients) =>
  clients.filter((client) => regularityRatio(client) < LOW_REGULARITY_RATIO).length,
);

/** Groupées par mois (« 2026-07 »), plus récentes d'abord — l'adapter trie déjà par date décroissante. */
export const selectOperationsByClient = createSelector(
  [
    operationsAdapterSelectors.selectAll,
    (_state: BankRootState, clientId: string) => clientId,
  ],
  (operations, clientId): Record<string, ClientOperation[]> => {
    const grouped: Record<string, ClientOperation[]> = {};
    for (const operation of operations) {
      if (operation.clientId !== clientId) {
        continue;
      }
      const month = operation.occurredAt.slice(0, 7);
      grouped[month] = [...(grouped[month] ?? []), operation];
    }
    return grouped;
  },
);

export interface SavingsProgress {
  balance: number;
  target: number;
  /** 0-1, borné même si le solde dépasse l'objectif (indicatif, jamais bloquant). */
  ratio: number;
}

/** Progression vers l'objectif d'épargne — objectif purement indicatif. */
export const selectSavingsProgress = (state: BankRootState, clientId: string): SavingsProgress | undefined => {
  const client = selectClientById(state, clientId);
  if (!client) {
    return undefined;
  }
  const target = client.savingsPlan.computed.targetAmount;
  const ratio = target === 0 ? 0 : Math.min(1, client.savingsBalance / target);
  return { balance: client.savingsBalance, target, ratio };
};

export const ClientsSelectors = {
  selectAllClients,
  selectClientById,
  selectClientsList,
  selectClientsCount,
  selectTotalActiveClientsLabel,
  selectLowRegularityCount,
  selectOperationsByClient,
  selectSavingsProgress,
};
