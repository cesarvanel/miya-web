/** Routes publiques du module auth — hors layout authentifié. */
export const AuthRoutes = {
  loginPath: '/login',
  forgotPasswordPath: '/forgot-password',
  resetPasswordSegment: 'reset-password',
  buildResetPasswordPath: (token: string): string => `/reset-password/${token}`,
  selectBankPath: '/select-bank',
} as const;
