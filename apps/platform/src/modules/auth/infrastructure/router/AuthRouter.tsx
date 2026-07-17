import type { RouteObject } from 'react-router-dom';
import { LoginPage } from '../views/login/LoginPage';
import { AuthRoutes } from './AuthRoutes';

/** Routes publiques — hors layout authentifié, aucun loader (pas de données à précharger). */
export const AuthRouter = (): RouteObject[] => [
  { path: AuthRoutes.loginPath, element: <LoginPage /> },
];
