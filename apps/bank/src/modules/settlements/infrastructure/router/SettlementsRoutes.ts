/** Segments de route du module settlements — relatifs au layout authentifié. */
export const SettlementsRoutes = {
  base: 'settlements',
  /** Segment relatif de la route enfant (imbriquée sous `base`, via <Outlet/>). */
  detailSegment: ':id',
  buildDetailPath: (id: string): string => `/settlements/${id}`,
} as const;
