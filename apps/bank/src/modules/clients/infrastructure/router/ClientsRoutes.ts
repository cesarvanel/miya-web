/** Segments de route du module clients — relatifs au layout authentifié. */
export const ClientsRoutes = {
  base: 'clients',
  newSegment: 'new',
  detailSegment: ':id',
  buildDetailPath: (id: string): string => `/clients/${id}`,
  newPath: '/clients/new',
} as const;
