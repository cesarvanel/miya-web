import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetWithdrawalsLoader } from '../views/loaders/WithdrawalsLoaders';
import { WithdrawalsPage } from '../views/index/WithdrawalsPage';
import { WithdrawalsRoutes } from './WithdrawalsRoutes';

export const WithdrawalsRouter = (store: BankStore): RouteObject[] => [
  {
    path: WithdrawalsRoutes.base,
    element: <WithdrawalsPage />,
    loader: GetWithdrawalsLoader(store),
  },
];
