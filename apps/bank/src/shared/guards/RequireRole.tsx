import React from 'react';
import { Navigate } from 'react-router-dom';
import { BankUserRole, authSelectors } from '@/modules/auth';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';

export type BankRole = BankUserRole;

interface RequireRoleProps {
  allow: BankRole[];
  children: React.ReactNode;
}

/** Garde de rôle — à l'intérieur de RequireAuth. Redirige vers / si le rôle n'est pas autorisé. */
export const RequireRole: React.FC<RequireRoleProps> = ({ allow, children }) => {
  const role = useBankSelector(authSelectors.selectCurrentRole);
  if (role === null || !allow.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};
