import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { collectionConfirmed } from '@/modules/collections';
import { withdrawalDisbursed } from '@/modules/withdrawals';
import { ClientsAdapter, ClientStatus, type Client } from '../entities/Client';
import { OperationsAdapter } from '../entities/ClientOperation';
import { SAVINGS_PLAN_FLOOR_AMOUNT, type DayOfWeek } from '../entities/SavingsPlan';
import { computeSavingsPlanComputed } from '../services/SavingsPlanCalculator';
import { FetchClientAsync } from '../../application/usecases/fetch-client-async/FetchClientAsync';
import { FetchClientOperationsAsync } from '../../application/usecases/fetch-client-operations-async/FetchClientOperationsAsync';
import { FetchClientsAsync } from '../../application/usecases/fetch-clients-async/FetchClientsAsync';

const initialState = {
  clients: ClientsAdapter.getInitialState(),
  operations: OperationsAdapter.getInitialState(),
  /** Chiffre d'affichage de l'en-tête (maquette : « 1 284 ») — indépendant de la pagination réelle. */
  totalActiveClientsLabel: null as number | null,
};

export type ClientsState = typeof initialState;

export const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {
    clientCreated: (state, action: PayloadAction<Client>) => {
      ClientsAdapter.addOne(state.clients, action.payload);
    },
    /**
     * Une seule règle de domaine : jamais en dessous du plancher banque.
     * Effectif dès le prochain jour de collecte — l'engagement en cours
     * (dates de début/fin) n'est pas rétroactif, seuls le montant et les
     * jours changent ; l'objectif recalculé reste indicatif.
     */
    savingsPlanChanged: (
      state,
      action: PayloadAction<{ id: string; amountPerCollectionDay: number; collectionDays: DayOfWeek[] }>,
    ) => {
      const client = state.clients.entities[action.payload.id];
      if (
        !client ||
        action.payload.amountPerCollectionDay < SAVINGS_PLAN_FLOOR_AMOUNT ||
        action.payload.collectionDays.length === 0
      ) {
        return;
      }
      ClientsAdapter.updateOne(state.clients, {
        id: action.payload.id,
        changes: {
          savingsPlan: {
            ...client.savingsPlan,
            amountPerCollectionDay: action.payload.amountPerCollectionDay,
            collectionDays: action.payload.collectionDays,
            computed: computeSavingsPlanComputed(
              action.payload.amountPerCollectionDay,
              action.payload.collectionDays,
              client.savingsPlan.engagement.startDate,
              client.savingsPlan.engagement.endDate,
              client.savingsPlan.openingDeposit,
            ),
          },
        },
      });
    },
    statusChanged: (state, action: PayloadAction<{ id: string; status: ClientStatus }>) => {
      ClientsAdapter.updateOne(state.clients, {
        id: action.payload.id,
        changes: { status: action.payload.status },
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(FetchClientsAsync.fulfilled, (state, action) => {
        ClientsAdapter.setAll(state.clients, action.payload.clients);
        state.totalActiveClientsLabel = action.payload.totalActiveClientsLabel;
      })
      .addCase(FetchClientAsync.fulfilled, (state, action) => {
        ClientsAdapter.upsertOne(state.clients, action.payload.client);
      })
      .addCase(FetchClientOperationsAsync.fulfilled, (state, action) => {
        OperationsAdapter.upsertMany(state.operations, action.payload.operations);
      })
      .addCase(collectionConfirmed, (state, action) => {
        const { clientId, amount } = action.payload;
        const client = state.clients.entities[clientId];
        if (client) {
          ClientsAdapter.updateOne(state.clients, {
            id: clientId,
            changes: {
              savingsBalance: client.savingsBalance + amount,
              regularity: {
                ...client.regularity,
                contributed: Math.min(client.regularity.expected, client.regularity.contributed + 1),
              },
            },
          });
        }
      })
      .addCase(withdrawalDisbursed, (state, action) => {
        const { clientId, amount } = action.payload;
        const client = state.clients.entities[clientId];
        if (client) {
          ClientsAdapter.updateOne(state.clients, {
            id: clientId,
            changes: {
              savingsBalance: client.savingsBalance - amount,
              pendingWithdrawal: null,
            },
          });
        }
      });
  },
});

export const ClientsActions = clientsSlice.actions;
