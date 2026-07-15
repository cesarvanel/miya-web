import type { Agency } from '../../domain/entities/Agency';
import type { CollectionZone } from '../../domain/entities/CollectionZone';

export interface CreateZoneInput {
  agencyId: string;
  name: string;
  sector: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
}

export interface AgenciesGateway {
  fetch: () => Promise<{ agencies: Agency[]; zones: CollectionZone[] }>;
  createZone: (input: CreateZoneInput) => Promise<{ zone: CollectionZone }>;
  assignZoneAgent: (zoneId: string, agentId: string, agentName: string) => Promise<void>;
}
