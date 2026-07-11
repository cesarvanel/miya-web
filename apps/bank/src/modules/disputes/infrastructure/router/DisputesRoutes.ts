/** Segments de route du module disputes — relatifs au layout authentifié. */
export const DisputesRoutes = {
  base: 'disputes',
  detailSegment: ':id',
  buildDetailPath: (id: string): string => `/disputes/${id}`,
} as const;
