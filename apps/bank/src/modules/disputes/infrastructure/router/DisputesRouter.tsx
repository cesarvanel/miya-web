import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetDisputesLoader } from '../views/loaders/DisputesLoaders';
import { DisputeResolutionPage } from '../views/detail/DisputeResolutionPage';
import { DisputesListPage } from '../views/index/DisputesListPage';
import { DisputesRoutes } from './DisputesRoutes';

export const DisputesRouter = (store: BankStore): RouteObject[] => [
  {
    path: DisputesRoutes.base,
    element: <DisputesListPage />,
    loader: GetDisputesLoader(store),
  },
  {
    path: `${DisputesRoutes.base}/${DisputesRoutes.detailSegment}`,
    element: <DisputeResolutionPage />,
    loader: GetDisputesLoader(store),
  },
];
