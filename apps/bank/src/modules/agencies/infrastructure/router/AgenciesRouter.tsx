import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetAgenciesLoader } from '../views/loaders/AgenciesLoaders';
import { ZonesAgenciesPage } from '../views/index/ZonesAgenciesPage';
import { AgenciesRoutes } from './AgenciesRoutes';

/** Monté comme enfant du nœud `admin` de `router.tsx` — `path` relatif à `/admin`. */
export const AgenciesRouter = (store: BankStore): RouteObject[] => [
  {
    path: AgenciesRoutes.zonesSegment,
    element: <ZonesAgenciesPage />,
    loader: GetAgenciesLoader(store),
  },
];
