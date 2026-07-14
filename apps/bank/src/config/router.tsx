import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { Card, EmptyState } from '@miya/ui';
import { AgentsRouter } from '@/modules/agents';
import { ClientsRouter } from '@/modules/clients';
import { CollectionsRouter } from '@/modules/collections';
import { DashboardRouter } from '@/modules/dashboard';
import { DisputesRouter } from '@/modules/disputes';
import { SettingsRouter } from '@/modules/settings';
import { SettlementsRouter } from '@/modules/settlements';
import { WithdrawalsRouter } from '@/modules/withdrawals';
import { RequireRole } from '@/shared/guards/RequireRole';
import { AdminShell } from '@/shared/layout/AdminShell';
import { ToastHost } from '@/shared/layout/ToastHost';
import { DesignSystemPage } from '@/devtools/DesignSystemPage';
import { SidebarContainer } from './layout/SidebarContainer';
import type { BankStore } from './stores/store';

const BankLayout: React.FC = () => (
  <div className="flex h-screen bg-cream">
    <SidebarContainer />
    <Outlet />
    <ToastHost />
  </div>
);

/** Zones & agences — carte du hub déjà branchée, section pas encore construite. */
const AdminZonesPlaceholder: React.FC = () => (
  <AdminShell breadcrumb={[{ label: 'Administration', to: '/admin' }, { label: 'Zones & agences' }]} title="Zones & agences">
    <Card padding="none">
      <EmptyState title="Zones & agences" description="Découpage géographique et rattachement des agences — à venir." />
    </Card>
  </AdminShell>
);

/** Placeholder du module auth (hors layout, non gardé). */
const LoginPlaceholder: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-cream">
    <Card className="w-[400px]">
      <div className="text-xl font-extrabold text-ink">
        Miya <span className="text-primary">Banque</span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink-muted">
        Connexion — module auth en construction.
      </p>
    </Card>
  </div>
);

/** Routes de l'app — chaque module fournit les siennes via son propre router. */
export const bankRoutes = (store: BankStore): RouteObject[] => [
  { path: '/auth/login', element: <LoginPlaceholder /> },
  /* Route de dev temporaire — vitrine des composants @miya/ui. */
  { path: '/design-system', element: <DesignSystemPage /> },
  {
    path: '/',
    element: (
      <RequireRole allow={['bank_admin', 'supervisor']}>
        <BankLayout />
      </RequireRole>
    ),
    children: [
      ...DashboardRouter(store),
      ...SettlementsRouter(store),
      ...DisputesRouter(store),
      ...CollectionsRouter(store),
      ...ClientsRouter(store),
      ...AgentsRouter(store),
      ...WithdrawalsRouter(store),
      {
        // TODO(auth): remettre allow={['bank_admin']} une fois l'auth branchée.
        path: 'admin',
        children: [
          ...SettingsRouter(store),
          { path: 'zones', element: <AdminZonesPlaceholder /> },
        ],
      },
    ],
  },
];

export const makeBankRouter = (store: BankStore) =>
  createBrowserRouter(bankRoutes(store));
