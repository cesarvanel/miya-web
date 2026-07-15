import { createSelector } from '@reduxjs/toolkit';
import type { BankRootState } from '@/config/stores/store';
import { AgenciesAdapter, type Agency } from '../entities/Agency';
import { ZonesAdapter, type CollectionZone } from '../entities/CollectionZone';

const agenciesAdapterSelectors = AgenciesAdapter.getSelectors(
  (state: BankRootState) => state.agencies.agencies,
);
const zonesAdapterSelectors = ZonesAdapter.getSelectors(
  (state: BankRootState) => state.agencies.zones,
);

export const selectAllAgencies = agenciesAdapterSelectors.selectAll;

export const selectAgencyById = (state: BankRootState, id: string): Agency | undefined =>
  agenciesAdapterSelectors.selectById(state, id);

export const selectAllZones = zonesAdapterSelectors.selectAll;

export const selectZoneById = (state: BankRootState, id: string): CollectionZone | undefined =>
  zonesAdapterSelectors.selectById(state, id);

export const selectZonesByAgency = createSelector(
  [selectAllZones, (_state: BankRootState, agencyId: string) => agencyId],
  (zones, agencyId): CollectionZone[] => zones.filter((zone) => zone.agencyId === agencyId),
);

export const selectAgencyCount = createSelector([selectAllAgencies], (agencies) => agencies.length);

export const selectZoneCount = createSelector([selectAllZones], (zones) => zones.length);

export const AgenciesSelectors = {
  selectAllAgencies,
  selectAgencyById,
  selectAllZones,
  selectZoneById,
  selectZonesByAgency,
  selectAgencyCount,
  selectZoneCount,
};
