import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { AdminHubPage } from '@/shared/layout/AdminHubPage';
import { GetSettingsLoader } from '../views/loaders/SettingsLoaders';
import { ChangeLogPage } from '../views/changelog/ChangeLogPage';
import { SettingsPage } from '../views/index/SettingsPage';
import { SettingsRoutes } from './SettingsRoutes';

/**
 * Routes montées comme enfants du nœud `admin` de `router.tsx` — les `path`
 * sont donc relatifs à `/admin`, pas absolus (sinon on obtient `/admin/admin`).
 */
export const SettingsRouter = (store: BankStore): RouteObject[] => [
  {
    index: true,
    element: <AdminHubPage />,
    loader: GetSettingsLoader(store),
  },
  {
    path: SettingsRoutes.settingsSegment,
    element: <SettingsPage />,
    loader: GetSettingsLoader(store),
  },
  {
    path: SettingsRoutes.changelogSegment,
    element: <ChangeLogPage />,
    loader: GetSettingsLoader(store),
  },
];
