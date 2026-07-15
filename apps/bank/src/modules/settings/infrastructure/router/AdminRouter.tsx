import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { AdminHubPage } from '@/shared/layout/AdminHubPage';
import { GetSettingsLoader, SettingsRouter } from '../../submodules/configuration';
import { AgenciesRouter } from '../../submodules/zones-agencies';
import { SupervisionRouter } from '../../submodules/supervision';

/**
 * Nœud `/admin` — hub (index) + les routes de chaque carte Administration
 * (chacune un sous-module avec son propre hexagone). Monté comme `children`
 * du nœud `admin` de `router.tsx` (paths donc relatifs à `/admin`).
 */
export const AdminRouter = (store: BankStore): RouteObject[] => [
  {
    index: true,
    element: <AdminHubPage />,
    loader: GetSettingsLoader(store),
  },
  ...SettingsRouter(store),
  ...AgenciesRouter(store),
  ...SupervisionRouter(store),
];
