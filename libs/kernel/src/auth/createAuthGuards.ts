import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export interface CreateAuthGuardsConfig<TRole extends string> {
  /** Statut d'auth courant (ex. selector branché sur le store de l'app). */
  useAuthStatus: () => string;
  /** Valeur de statut correspondant à « non connecté ». */
  anonymousStatus: string;
  /** Route publique de connexion — reçoit `?returnUrl=...`. */
  loginPath: string;
  /** Rôle courant, `null` tant que la session n'est pas hydratée. */
  useRole: () => TRole | null;
  /** Rendue quand le rôle est connu mais hors de la liste `allow`. */
  ForbiddenPage: React.ComponentType;
  /** Repli quand le rôle est `null` — par défaut `/`. */
  noRoleFallbackPath?: string;
}

export interface RequireAuthProps {
  children: React.ReactNode;
}

export interface RequireRoleProps<TRole extends string> {
  allow: TRole[];
  children: React.ReactNode;
}

/**
 * Fabrique les gardes `RequireAuth`/`RequireRole` à partir des selectors et
 * routes propres à chaque app — la logique (rediriger si anonyme, afficher
 * la 403 si rôle hors liste) est générique, seuls les hooks/chemins injectés
 * changent entre apps.
 */
export const createAuthGuards = <TRole extends string>(
  config: CreateAuthGuardsConfig<TRole>,
): {
  RequireAuth: React.FC<RequireAuthProps>;
  RequireRole: React.FC<RequireRoleProps<TRole>>;
} => {
  const RequireAuth: React.FC<RequireAuthProps> = ({ children }) => {
    const status = config.useAuthStatus();
    const location = useLocation();

    if (status === config.anonymousStatus) {
      const returnUrl = `${location.pathname}${location.search}`;
      return React.createElement(Navigate, {
        to: `${config.loginPath}?returnUrl=${encodeURIComponent(returnUrl)}`,
        replace: true,
      });
    }

    return React.createElement(React.Fragment, null, children);
  };

  const RequireRole: React.FC<RequireRoleProps<TRole>> = ({ allow, children }) => {
    const role = config.useRole();

    if (role === null) {
      return React.createElement(Navigate, { to: config.noRoleFallbackPath ?? '/', replace: true });
    }
    if (!allow.includes(role)) {
      return React.createElement(config.ForbiddenPage);
    }
    return React.createElement(React.Fragment, null, children);
  };

  return { RequireAuth, RequireRole };
};
