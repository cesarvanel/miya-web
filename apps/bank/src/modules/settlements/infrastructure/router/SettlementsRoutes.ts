export const SettlementsRoutes = {
  base: 'settlements',
  detail: 'settlements/:id',
  buildDetailPath: (id: string): string => `/settlements/${id}`,
} as const;
