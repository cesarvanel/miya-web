import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { Card, EmptyState } from '@miya/ui';
import { AuthRouter, ConfirmLogoutModal } from '@/modules/auth';
import { OverviewPage } from '@/modules/overview';
import { RequireAuth } from '@/shared/guards/RequireAuth';
import { PageShell } from '@/shared/layout/PageShell';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';
import { SidebarContainer } from './layout/SidebarContainer';

/** Layout des pages authentifiées : Sidebar fixe + colonne <Outlet/>. */
const PlatformLayout: React.FC = () => (
  <div className="flex h-screen bg-cream">
    <SidebarContainer />
    <div className="flex-1 overflow-y-auto">
      <Outlet />
    </div>
    <ConfirmLogoutModal />
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

export const platformRoutes: RouteObject[] = [
  ...AuthRouter(),
  {
    path: '/',
    element: (
      <RequireAuth>
        <PlatformLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'tenants', element: <ModulePlaceholder title="Banques" /> },
      { path: 'billing', element: <ModulePlaceholder title="Abonnements" /> },
      { path: 'activity', element: <ModulePlaceholder title="Activité plateforme" /> },
      { path: 'settings', element: <ModulePlaceholder title="Paramètres" /> },
      { path: 'profile', element: <ModulePlaceholder title="Mon profil" /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export const makePlatformRouter = () => createBrowserRouter(platformRoutes);
