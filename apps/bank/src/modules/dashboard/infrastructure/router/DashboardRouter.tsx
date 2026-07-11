import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { DashboardPage } from '../views/DashboardPage';
import { GetDaySummaryLoader } from './DashboardLoaders';

/** Le dashboard est la page d'accueil du rôle responsable — route index ('/'). */
export const DashboardRouter = (store: BankStore): RouteObject[] => [
  {
    index: true,
    element: <DashboardPage />,
    loader: GetDaySummaryLoader(store),
  },
];
