import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { Card, EmptyState } from '@miya/ui';
import { SettlementsRouter } from '@/modules/settlements';
import { RequireRole } from '@/shared/guards/RequireRole';
import { PageShell } from '@/shared/layout/PageShell';
import { Sidebar } from '@/shared/layout/Sidebar';
import { ToastHost } from '@/shared/layout/ToastHost';
import { DesignSystemPage } from '@/devtools/DesignSystemPage';
import type { BankStore } from './stores/store';

const BankLayout: React.FC = () => (
  <div className="flex h-screen bg-cream">
    <Sidebar />
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
      { index: true, element: <ModulePlaceholder title="Tableau de bord" /> },
      ...SettlementsRouter(store),
      { path: 'disputes', element: <ModulePlaceholder title="Contestations" /> },
      { path: 'collections', element: <ModulePlaceholder title="Tournées" /> },
      { path: 'clients', element: <ModulePlaceholder title="Clients" /> },
      { path: 'agents', element: <ModulePlaceholder title="Agents" /> },
      { path: 'withdrawals', element: <ModulePlaceholder title="Retraits" /> },
      { path: 'settings', element: <ModulePlaceholder title="Paramètres" /> },
    ],
  },
];

export const makeBankRouter = (store: BankStore) =>
  createBrowserRouter(bankRoutes(store));
