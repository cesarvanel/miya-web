import React from 'react';
import { Toaster } from '@miya/ui';
import { useToasts } from '@/shared/toasts';

/** Empile les toasts globaux de l'app (branché une fois dans le layout). */
export const ToastHost: React.FC = () => {
  const { toasts, dismiss } = useToasts();
  return <Toaster toasts={toasts} onDismiss={dismiss} />;
};
