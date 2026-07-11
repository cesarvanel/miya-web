/** Segments de route du module collections — relatifs au layout authentifié. */
export const CollectionsRoutes = {
  base: 'collections',
  detailSegment: 'rounds/:roundId',
  buildDetailPath: (roundId: string): string => `/collections/rounds/${roundId}`,
} as const;
