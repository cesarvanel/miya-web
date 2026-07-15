import { createEntityAdapter } from '@reduxjs/toolkit';

export interface Agency {
  id: string;
  name: string;
  sector: string;
  agentsCount: number;
  clientsCount: number;
  savingsManaged: number;
  managerName: string;
}

export const AgenciesAdapter = createEntityAdapter<Agency, string>({
  selectId: (agency) => agency.id,
});
