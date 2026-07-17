import { createToastSystem } from '@miya/kernel';

/** Système de toasts de l'app platform — un seul empilement, monté par ToastHost. */
export const { toastSlice, pushToast, dismissToast, useToasts } =
  createToastSystem();
