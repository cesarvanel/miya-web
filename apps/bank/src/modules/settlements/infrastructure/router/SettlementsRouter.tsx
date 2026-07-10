import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetSettlementSlipLoader } from '../views/detail/loaders/SettlementsLoaders';
import { SlipDetailPage } from '../views/detail/SlipDetailPage';
import {
  SettlementQueuePage,
  SettlementsIndexRedirect,
} from '../views/index/SettlementQueuePage';
import { GetSettlementQueueLoader } from '../views/index/loaders/SettlementsLoaders';
import { SettlementsRoutes } from './SettlementsRoutes';

/**
 * Layout + enfants imbriqués : la file (gauche) reste montée, seul le
 * panneau détail (droite, <Outlet/>) change avec l'id sélectionné —
 * un seul écran, comme sur la maquette 2a.
 */
export const SettlementsRouter = (store: BankStore): RouteObject[] => [
  {
    path: SettlementsRoutes.base,
    element: <SettlementQueuePage />,
    loader: GetSettlementQueueLoader(store),
    children: [
      { index: true, element: <SettlementsIndexRedirect /> },
      {
        path: SettlementsRoutes.detailSegment,
        element: <SlipDetailPage />,
        loader: GetSettlementSlipLoader(store),
      },
    ],
  },
];
