export interface CreateZoneCommand {
  agencyId: string;
  name: string;
  sector: string;
  assignedAgentId?: string;
  assignedAgentName?: string;
}
