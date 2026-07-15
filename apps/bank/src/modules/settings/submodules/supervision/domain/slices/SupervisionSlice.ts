import { createSlice } from '@reduxjs/toolkit';
import type { SupervisionDaySnapshot, SupervisionMonthSnapshot } from '../entities/Supervision';
import { FetchSupervisionAsync } from '../../application/usecases/fetch-supervision-async/FetchSupervisionAsync';

const initialState = {
  day: null as SupervisionDaySnapshot | null,
  month: null as SupervisionMonthSnapshot | null,
};

export type SupervisionState = typeof initialState;

export const supervisionSlice = createSlice({
  name: 'supervision',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(FetchSupervisionAsync.fulfilled, (state, action) => {
      state.day = action.payload.day;
      state.month = action.payload.month;
    });
  },
});
