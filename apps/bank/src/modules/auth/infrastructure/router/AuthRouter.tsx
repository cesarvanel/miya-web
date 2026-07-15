import type { RouteObject } from 'react-router-dom';
import { BankSelectionPage } from '../views/bank-selection/BankSelectionPage';
import { ForgotPasswordPage } from '../views/forgot-password/ForgotPasswordPage';
import { LoginPage } from '../views/login/LoginPage';
import { ResetPasswordPage } from '../views/reset-password/ResetPasswordPage';
import { AuthRoutes } from './AuthRoutes';

/** Routes publiques — hors layout authentifié, aucun loader (pas de données à précharger). */
export const AuthRouter = (): RouteObject[] => [
  { path: AuthRoutes.loginPath, element: <LoginPage /> },
  { path: AuthRoutes.forgotPasswordPath, element: <ForgotPasswordPage /> },
  { path: `/${AuthRoutes.resetPasswordSegment}/:token`, element: <ResetPasswordPage /> },
  { path: AuthRoutes.selectBankPath, element: <BankSelectionPage /> },
];
