import React from 'react';
import { createBrowserRouter, Outlet, type RouteObject } from 'react-router-dom';
import { ActivityPage } from '@/modules/activity';
import { AuthRouter, ConfirmLogoutModal } from '@/modules/auth';
import { BillingPage, EditPlanModal, MarkInvoicePaidModal, SendReminderModal } from '@/modules/billing';
import { OverviewPage } from '@/modules/overview';
import { ChangePasswordModal, ProfilePage } from '@/modules/profile';
import {
  ChangeCollaboratorRoleModal,
  ChangeLogDrawerPage,
  ConfirmResendInvitationModal as ConfirmResendCollaboratorInvitationModal,
  EditPlatformIdentityModal,
  InviteCollaboratorModal,
  PlatformSettingsPage,
  RevokeCollaboratorModal,
  TemplateEditorModal,
} from '@/modules/settings-platform';
import {
  ChangePlanModal,
  ConfirmReactivateModal,
  NewTenantPage,
  ResendInvitationModal,
  SuspendTenantModal,
  TenantDetailPage,
  TenantsListPage,
} from '@/modules/tenants';
import { RequireAuth } from '@/shared/guards/RequireAuth';
import { ToastHost } from '@/shared/layout/ToastHost';
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
    <ChangePlanModal />
    <SuspendTenantModal />
    <ConfirmReactivateModal />
    <ResendInvitationModal />
    <EditPlanModal />
    <MarkInvoicePaidModal />
    <SendReminderModal />
    <EditPlatformIdentityModal />
    <InviteCollaboratorModal />
    <ChangeCollaboratorRoleModal />
    <RevokeCollaboratorModal />
    <ConfirmResendCollaboratorInvitationModal />
    <TemplateEditorModal />
    <ChangePasswordModal />
    <ToastHost />
  </div>
);

export const platformRoutes: RouteObject[] = [
  ...AuthRouter(),
  {
    path: '/tenants/new',
    element: (
      <RequireAuth>
        <NewTenantPage />
        <ToastHost />
      </RequireAuth>
    ),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <PlatformLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <OverviewPage /> },
      { path: 'tenants', element: <TenantsListPage /> },
      { path: 'tenants/:id', element: <TenantDetailPage /> },
      { path: 'billing', element: <BillingPage /> },
      { path: 'activity', element: <ActivityPage /> },
      { path: 'settings', element: <PlatformSettingsPage /> },
      { path: 'settings/change-log', element: <ChangeLogDrawerPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
];

export const makePlatformRouter = () => createBrowserRouter(platformRoutes);
