import React from 'react';
import { Navigate } from 'react-router-dom';

/** Rôle console éditeur (« Super admin » dans les maquettes). */
export type PlatformRole = 'super_admin';

/**
 * TODO(auth): brancher sur authSelectors.role (module auth) — en attendant,
 * le squelette laisse passer un super admin.
 */
export const useCurrentRole = (): PlatformRole | null => 'super_admin';

interface RequireRoleProps {
  allow: PlatformRole[];
  children: React.ReactNode;
}

/** Garde de route : redirige vers /auth/login si le rôle n'est pas autorisé. */
export const RequireRole: React.FC<RequireRoleProps> = ({ allow, children }) => {
  const role = useCurrentRole();
  if (role === null || !allow.includes(role)) {
    return <Navigate to="/auth/login" replace />;
  }
  return <>{children}</>;
};
