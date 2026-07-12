import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { collectionConfirmed } from '@/modules/collections';
import { ClientsAdapter, ClientStatus, type Client } from '../entities/Client';
import { OperationsAdapter } from '../entities/ClientOperation';
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
    /** Une seule règle de domaine : jamais en dessous du plancher du plan. */
    usualAmountChanged: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const client = state.clients.entities[action.payload.id];
      if (!client || action.payload.amount < client.plan.floorAmount) {
        return;
      }
      ClientsAdapter.updateOne(state.clients, {
        id: action.payload.id,
        changes: { usualAmount: action.payload.amount },
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
      });
  },
});

export const ClientsActions = clientsSlice.actions;
