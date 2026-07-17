import { createSlice } from '@reduxjs/toolkit';
import type { PlatformAlert, PlatformKpis, TopBank, VolumePoint } from '../entities/Overview';
import { FetchOverviewAsync } from '../../application/usecases/fetch-overview-async/FetchOverviewAsync';

const initialState = {
  kpis: null as PlatformKpis | null,
  volumeSeries: [] as VolumePoint[],
  topBanks: [] as TopBank[],
  alerts: [] as PlatformAlert[],
};

export type OverviewState = typeof initialState;

export const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(FetchOverviewAsync.fulfilled, (state, action) => {
      state.kpis = action.payload.kpis;
      state.volumeSeries = action.payload.volumeSeries;
      state.topBanks = action.payload.topBanks;
      state.alerts = action.payload.alerts;
    });
  },
});
