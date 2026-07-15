import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetSupervisionLoader } from '../views/loaders/SupervisionLoaders';
import { SupervisionPage } from '../views/index/SupervisionPage';
import { SupervisionRoutes } from './SupervisionRoutes';

/** Monté comme enfant du nœud `admin` de `router.tsx` — `path` relatif à `/admin`. */
export const SupervisionRouter = (store: BankStore): RouteObject[] => [
  {
    path: SupervisionRoutes.supervisionSegment,
    element: <SupervisionPage />,
    loader: GetSupervisionLoader(store),
  },
];
