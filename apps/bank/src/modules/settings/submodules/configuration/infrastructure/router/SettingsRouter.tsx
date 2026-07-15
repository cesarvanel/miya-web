import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetSettingsLoader } from '../views/loaders/SettingsLoaders';
import { ChangeLogPage } from '../views/changelog/ChangeLogPage';
import { SettingsPage } from '../views/index/SettingsPage';
import { SettingsRoutes } from './SettingsRoutes';

/**
 * Routes de la carte Configuration — montées par `AdminRouter` (nœud parent
 * `settings`) comme enfants du nœud `admin` de `router.tsx` : les `path` sont
 * donc relatifs à `/admin`, pas absolus (sinon on obtient `/admin/admin`).
 * Le hub `/admin` lui-même est monté par `AdminRouter`, pas ici.
 */
export const SettingsRouter = (store: BankStore): RouteObject[] => [
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
