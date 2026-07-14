import React from 'react';
import { Navigate } from 'react-router-dom';

export type BankRole = 'bank_admin' | 'supervisor';

/**
 * Rôle courant de l'utilisateur connecté.
 * TODO(auth): brancher sur authSelectors.role (module auth) — en attendant,
 * le squelette laisse passer un bank_admin pour que l'espace Administration
 * (gardé par `allow={['bank_admin']}`) reste explorable.
 */
export const useCurrentRole = (): BankRole | null => 'bank_admin';

interface RequireRoleProps {
  allow: BankRole[];
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
