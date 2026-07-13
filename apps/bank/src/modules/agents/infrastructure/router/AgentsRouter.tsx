import React from 'react';
import type { RouteObject } from 'react-router-dom';
import type { BankStore } from '@/config/stores/store';
import { GetAgentDetailLoader, GetAgentsLoader } from '../views/loaders/AgentsLoaders';
import { AgentDetailPage } from '../views/detail/AgentDetailPage';
import { AgentsListPage } from '../views/index/AgentsListPage';
import { NewAgentPage } from '../views/new/NewAgentPage';
import { AgentsRoutes } from './AgentsRoutes';

export const AgentsRouter = (store: BankStore): RouteObject[] => [
  {
    path: AgentsRoutes.base,
    element: <AgentsListPage />,
    loader: GetAgentsLoader(store),
  },
  {
    path: `${AgentsRoutes.base}/${AgentsRoutes.newSegment}`,
    element: <NewAgentPage />,
  },
  {
    path: `${AgentsRoutes.base}/${AgentsRoutes.detailSegment}`,
    element: <AgentDetailPage />,
    loader: GetAgentDetailLoader(store),
  },
];
