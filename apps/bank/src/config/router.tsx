import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { Card, EmptyState } from '@miya/ui';
import { AgentsRouter } from '@/modules/agents';
import { ClientsRouter } from '@/modules/clients';
import { CollectionsRouter } from '@/modules/collections';
import { DashboardRouter } from '@/modules/dashboard';
import { DisputesRouter } from '@/modules/disputes';
import { SettlementsRouter } from '@/modules/settlements';
import { WithdrawalsRouter } from '@/modules/withdrawals';
import { RequireRole } from '@/shared/guards/RequireRole';
import { PageShell } from '@/shared/layout/PageShell';
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

interface ModulePlaceholderProps {
  title: string;
}

/** Placeholder en attendant les views des modules. */
const ModulePlaceholder: React.FC<ModulePlaceholderProps> = ({ title }) => (
  <PageShell title={title}>
    <Card padding="none">
      <EmptyState
        title={title}
        description="Module en construction — les vues arrivent avec l'intégration."
      />
    </Card>
  </PageShell>
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
      { path: 'settings', element: <ModulePlaceholder title="Paramètres" /> },
    ],
  },
];

export const makeBankRouter = (store: BankStore) =>
  createBrowserRouter(bankRoutes(store));
