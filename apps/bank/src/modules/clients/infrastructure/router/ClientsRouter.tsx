import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetClientDetailLoader, GetClientsLoader } from '../views/loaders/ClientsLoaders';
import { ClientDetailPage } from '../views/detail/ClientDetailPage';
import { ClientsListPage } from '../views/index/ClientsListPage';
import { NewClientPage } from '../views/new/NewClientPage';
import { ClientsRoutes } from './ClientsRoutes';

export const ClientsRouter = (store: BankStore): RouteObject[] => [
  {
    path: ClientsRoutes.base,
    element: <ClientsListPage />,
    loader: GetClientsLoader(store),
  },
  {
    path: `${ClientsRoutes.base}/${ClientsRoutes.newSegment}`,
    element: <NewClientPage />,
  },
  {
    path: `${ClientsRoutes.base}/${ClientsRoutes.detailSegment}`,
    element: <ClientDetailPage />,
    loader: GetClientDetailLoader(store),
  },
];
