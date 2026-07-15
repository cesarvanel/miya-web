import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { AgenciesAdapter } from '../entities/Agency';
import { ZonesAdapter, type CollectionZone } from '../entities/CollectionZone';
import { FetchAgenciesAsync } from '../../application/usecases/fetch-agencies-async/FetchAgenciesAsync';

const initialState = {
  agencies: AgenciesAdapter.getInitialState(),
  zones: ZonesAdapter.getInitialState(),
};

export type AgenciesState = typeof initialState;

export const agenciesSlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    zoneCreated: (state, action: PayloadAction<CollectionZone>) => {
      ZonesAdapter.addOne(state.zones, action.payload);
    },
    zoneAgentAssigned: (
      state,
      action: PayloadAction<{ zoneId: string; agentId: string; agentName: string }>,
    ) => {
      const { zoneId, agentId, agentName } = action.payload;
      ZonesAdapter.updateOne(state.zones, {
        id: zoneId,
        changes: { assignedAgentId: agentId, assignedAgentName: agentName },
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(FetchAgenciesAsync.fulfilled, (state, action) => {
      AgenciesAdapter.upsertMany(state.agencies, action.payload.agencies);
      ZonesAdapter.upsertMany(state.zones, action.payload.zones);
    });
  },
});

export const AgenciesActions = agenciesSlice.actions;
