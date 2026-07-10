import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { Card, EmptyState } from '@miya/ui';
import { RequireRole } from '@/shared/guards/RequireRole';
import { PageShell } from '@/shared/layout/PageShell';
import { Sidebar } from '@/shared/layout/Sidebar';

/** Layout des pages authentifiées : Sidebar fixe + colonne <Outlet/>. */
const PlatformLayout: React.FC = () => (
  <div className="flex h-screen bg-cream">
    <Sidebar />
    <Outlet />
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
        Miya <span className="text-primary">Admin</span>
      </div>
      <p className="mt-2 text-sm font-medium text-ink-muted">
        Connexion — module auth en construction.
      </p>
    </Card>
  </div>
);

export const platformRoutes: RouteObject[] = [
  { path: '/auth/login', element: <LoginPlaceholder /> },
  {
    path: '/',
    element: (
      <RequireRole allow={['super_admin']}>
        <PlatformLayout />
      </RequireRole>
    ),
    children: [
      { index: true, element: <ModulePlaceholder title="Vue d'ensemble" /> },
      { path: 'tenants', element: <ModulePlaceholder title="Banques" /> },
      { path: 'billing', element: <ModulePlaceholder title="Abonnements" /> },
      { path: 'activity', element: <ModulePlaceholder title="Activité plateforme" /> },
      /* Lien maquette sans module dédié pour l'instant. */
      { path: 'settings', element: <ModulePlaceholder title="Paramètres" /> },
    ],
  },
];

export const makePlatformRouter = () => createBrowserRouter(platformRoutes);
