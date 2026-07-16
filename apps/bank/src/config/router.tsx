import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { AuthActions, AuthRouter, AuthStatus, BankUserRole, ConfirmLogoutModal, SessionExpiredModal } from '@/modules/auth';
import { ClientsRouter } from '@/modules/clients';
import { CollectionsRouter } from '@/modules/collections';
import { DashboardRouter } from '@/modules/dashboard';
import { DisputesRouter } from '@/modules/disputes';
import { ProfileRouter } from '@/modules/profile';
import { AdminRouter, AgentsRouter } from '@/modules/settings';
import { SettlementsRouter } from '@/modules/settlements';
import { WithdrawalsRouter } from '@/modules/withdrawals';
import { RequireAuth } from '@/shared/guards/RequireAuth';
import { RequireRole } from '@/shared/guards/RequireRole';
import { ToastHost } from '@/shared/layout/ToastHost';
import { NotFoundPage } from '@/shared/pages/NotFoundPage';
import { DesignSystemPage } from '@/devtools/DesignSystemPage';
import { useBankDispatch, useBankSelector } from './stores/root-hook/RootHook';
import { SidebarContainer } from './layout/SidebarContainer';
import type { BankStore } from './stores/store';

/** Bouton de dev temporaire — déclenche la modale Session expirée sans attendre un vrai 401. */
const DevExpireSessionButton: React.FC = () => {
  const dispatch = useBankDispatch();
  return (
    <button
      type="button"
      onClick={() => dispatch(AuthActions.sessionExpired())}
      className="fixed bottom-3 left-3 z-40 cursor-pointer rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-bold text-white/80 hover:bg-ink"
    >
      DEV · Expirer la session
    </button>
  );
};

const BankLayout: React.FC = () => {
  const sessionExpired = useBankSelector((state) => state.auth.status === AuthStatus.SessionExpired);
  return (
    <div className="flex h-screen bg-cream">
      <div className={['flex flex-1 transition-[filter]', sessionExpired ? 'pointer-events-none blur-[3px]' : ''].join(' ')}>
        <SidebarContainer />
        <Outlet />
      </div>
      <ToastHost />
      <SessionExpiredModal />
      <ConfirmLogoutModal />
      <DevExpireSessionButton />
    </div>
  );
};

/** Routes de l'app — chaque module fournit les siennes via son propre router. */
export const bankRoutes = (store: BankStore): RouteObject[] => [
  ...AuthRouter(),
  /* Route de dev temporaire — vitrine des composants @miya/ui. */
  { path: '/design-system', element: <DesignSystemPage /> },
  {
    path: '/',
    element: (
      <RequireAuth>
        <BankLayout />
      </RequireAuth>
    ),
    children: [
      ...DashboardRouter(store),
      ...SettlementsRouter(store),
      ...DisputesRouter(store),
      ...CollectionsRouter(store),
      ...ClientsRouter(store),
      ...AgentsRouter(store),
      ...WithdrawalsRouter(store),
      ...ProfileRouter(store),
      {
        path: 'admin',
        element: (
          <RequireRole allow={[BankUserRole.BankAdmin]}>
            <Outlet />
          </RequireRole>
        ),
        children: AdminRouter(store),
      },
    ],
  },
];

export const makeBankRouter = (store: BankStore) =>
  createBrowserRouter(bankRoutes(store));
