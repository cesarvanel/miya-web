import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { SettlementQueuePage } from '../views/index/SettlementQueuePage';
import { SlipDetailPage } from '../views/SlipDetailPage';
import {
  GetSettlementQueueLoader,
  GetSettlementSlipLoader,
} from '../views/index/loaders/SettlementsLoaders';
import { SettlementsRoutes } from './SettlementsRoutes';

export const SettlementsRouter = (store: BankStore): RouteObject[] => [
  {
    path: SettlementsRoutes.base,
    element: <SettlementQueuePage />,
    loader: GetSettlementQueueLoader(store),
  },
  {
    path: SettlementsRoutes.detail,
    element: <SlipDetailPage />,
    loader: GetSettlementSlipLoader(store),
  },
];
