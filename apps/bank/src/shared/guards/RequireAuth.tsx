import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthStatus, authSelectors } from '@/modules/auth';
import { useBankSelector } from '@/config/stores/root-hook/RootHook';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Garde englobant toutes les routes de l'app — redirige vers /login avec
 * `returnUrl` si `Anonymous`. `SessionExpired` reste ici (la modale s'affiche
 * par-dessus la page courante, pas de redirection — voir SessionExpiredModal).
 */
export const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
  const status = useBankSelector(authSelectors.selectAuthStatus);
  const location = useLocation();

  if (status === AuthStatus.Anonymous) {
    const returnUrl = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  return <>{children}</>;
};
