/** Segments de route du module agents — relatifs au layout authentifié. */
export const AgentsRoutes = {
  base: 'agents',
  newSegment: 'new',
  detailSegment: ':id',
  buildDetailPath: (id: string): string => `/agents/${id}`,
  newPath: '/agents/new',
} as const;
