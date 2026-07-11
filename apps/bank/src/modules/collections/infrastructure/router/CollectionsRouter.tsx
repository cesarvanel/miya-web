import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { RoundDetailPage } from '../views/detail/RoundDetailPage';
import { RoundsListPage } from '../views/index/RoundsListPage';
import { GetRoundDetailLoader, GetRoundsLoader } from '../views/loaders/CollectionsLoaders';
import { CollectionsRoutes } from './CollectionsRoutes';

export const CollectionsRouter = (store: BankStore): RouteObject[] => [
  {
    path: CollectionsRoutes.base,
    element: <RoundsListPage />,
    loader: GetRoundsLoader(store),
  },
  {
    path: `${CollectionsRoutes.base}/${CollectionsRoutes.detailSegment}`,
    element: <RoundDetailPage />,
    loader: GetRoundDetailLoader(store),
  },
];
