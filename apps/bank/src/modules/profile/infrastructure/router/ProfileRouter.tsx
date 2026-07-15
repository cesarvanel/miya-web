import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetProfileLoader } from '../views/loaders/ProfileLoaders';
import { ProfilePage } from '../views/index/ProfilePage';
import { ProfileRoutes } from './ProfileRoutes';

export const ProfileRouter = (store: BankStore): RouteObject[] => [
  {
    path: ProfileRoutes.base,
    element: <ProfilePage />,
    loader: GetProfileLoader(store),
  },
];
