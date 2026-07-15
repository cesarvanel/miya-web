import type { AgenciesGateway, CreateZoneInput } from '../../application/ports/AgenciesGateway';
import type { Agency } from '../../domain/entities/Agency';
import type { CollectionZone } from '../../domain/entities/CollectionZone';

/**
 * Mêmes ids/noms d'agence que `settings.validationChains` (`agency-mokolo`,
 * `agency-essos`) — même histoire racontée dans les deux modules.
 */
const seedAgencies = (): Agency[] => [
  { id: 'agency-mokolo', name: 'Agence Mokolo', sector: 'Centre', agentsCount: 7, clientsCount: 642, savingsManaged: 31_800_000, managerName: 'Antoine Mbarga' },
  { id: 'agency-essos', name: 'Agence Essos', sector: 'Centre', agentsCount: 5, clientsCount: 380, savingsManaged: 14_200_000, managerName: 'Pauline Owona' },
  { id: 'agency-mvog-ada', name: 'Agence Mvog-Ada', sector: 'Centre', agentsCount: 2, clientsCount: 140, savingsManaged: 5_100_000, managerName: 'Serge Biyiha' },
];

/**
 * Zones de collecte de l'Agence Mokolo — mêmes ids d'agent que
 * `FakeAgentGateway` quand un vrai collecteur correspond (Cédric Nkoulou,
 * Grace Atangana, Rosalie Fotso) ; « Aïcha Bakari » n'existe pas dans le
 * roster réel, gardée en simple libellé (non réaffectable via son id).
 */
const seedZones = (): CollectionZone[] => [
  { id: 'zone-marche-mokolo', agencyId: 'agency-mokolo', name: 'Marché Mokolo', sector: 'Secteur central', assignedAgentId: 'agent-cedric-nkoulou', assignedAgentName: 'Cédric Nkoulou', clientsCount: 52, regularityRate: 94 },
  { id: 'zone-carrefour-warda', agencyId: 'agency-mokolo', name: 'Carrefour Warda', sector: 'Nord', assignedAgentId: 'agent-grace-atangana', assignedAgentName: 'Grace Atangana', clientsCount: 45, regularityRate: 96 },
  { id: 'zone-briqueterie', agencyId: 'agency-mokolo', name: 'Briqueterie', sector: 'Est', assignedAgentId: null, assignedAgentName: 'Aïcha Bakari', clientsCount: 38, regularityRate: 91 },
  { id: 'zone-messa', agencyId: 'agency-mokolo', name: 'Messa', sector: 'Sud-ouest', assignedAgentId: null, assignedAgentName: null, clientsCount: 27, regularityRate: null },
  { id: 'zone-tsinga', agencyId: 'agency-mokolo', name: 'Tsinga', sector: 'Ouest', assignedAgentId: 'agent-rosalie-fotso', assignedAgentName: 'Rosalie Fotso', clientsCount: 40, regularityRate: 89 },
];

const delay = (): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 300));

/** Gateway en mémoire — pas de backend. Latence simulée (300-600ms). */
export class FakeAgenciesGateway implements AgenciesGateway {
  private agencies: Agency[] = seedAgencies();
  private zones: CollectionZone[] = seedZones();
  private nextZoneSeq = 1;

  async fetch(): Promise<{ agencies: Agency[]; zones: CollectionZone[] }> {
    await delay();
    return { agencies: structuredClone(this.agencies), zones: structuredClone(this.zones) };
  }

  async createZone(input: CreateZoneInput): Promise<{ zone: CollectionZone }> {
    await delay();
    const zone: CollectionZone = {
      id: `zone-custom-${this.nextZoneSeq++}`,
      agencyId: input.agencyId,
      name: input.name,
      sector: input.sector,
      assignedAgentId: input.assignedAgentId ?? null,
      assignedAgentName: input.assignedAgentName ?? null,
      clientsCount: 0,
      regularityRate: null,
    };
    this.zones = [...this.zones, zone];
    return { zone: structuredClone(zone) };
  }

  async assignZoneAgent(zoneId: string, agentId: string, agentName: string): Promise<void> {
    await delay();
    const zone = this.zones.find((candidate) => candidate.id === zoneId);
    if (!zone) {
      throw new Error(`Zone introuvable : ${zoneId}`);
    }
    zone.assignedAgentId = agentId;
    zone.assignedAgentName = agentName;
  }
}
