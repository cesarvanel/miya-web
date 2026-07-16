import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastInput {
  variant: ToastVariant;
  title: string;
  message?: string;
}

export interface ToastEntry extends ToastInput {
  id: string;
}

export interface ToastState {
  items: ToastEntry[];
}

export interface UseToastsResult {
  toasts: ToastEntry[];
  dismiss: (id: string) => void;
}

/** Auto-disparition des toasts — cohérent avec les maquettes ("toast disparaît après 4s"). */
const AUTO_DISMISS_MS = 4_000;

/**
 * Builds a typed toast system for an app: a slice (`pushToast`/`dismissToast`)
 * plus a `useToasts()` hook. Each app instantiates it once in `src/shared`,
 * mounts the reducer under a store key, and renders `<Toaster/>` (@miya/ui)
 * fed by `useToasts()` once near the root layout.
 */
export const createToastSystem = (sliceName = 'toasts') => {
  const initialState: ToastState = { items: [] };

  const toastSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
      pushToast: {
        reducer: (state, action: PayloadAction<ToastEntry>) => {
          state.items.push(action.payload);
        },
        prepare: (input: ToastInput) => ({
          payload: { ...input, id: crypto.randomUUID() },
        }),
      },
      dismissToast: (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((toast) => toast.id !== action.payload);
      },
    },
  });

  const { pushToast, dismissToast } = toastSlice.actions;

  const selectItems = (state: unknown): ToastEntry[] => {
    const sliceState = (state as Record<string, ToastState | undefined>)[
      sliceName
    ];
    return sliceState?.items ?? [];
  };

  const useToasts = (): UseToastsResult => {
    const dispatch = useDispatch();
    const toasts = useSelector(selectItems);
    const dismiss = useCallback(
      (id: string) => dispatch(dismissToast(id)),
      [dispatch],
    );

    /**
     * Programme la disparition de chaque toast une seule fois, à son
     * arrivée — les handles vivent dans un ref (pas le state du composant)
     * pour ne jamais être recréés/annulés par un simple re-render.
     */
    const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
    useEffect(() => {
      const timers = timersRef.current;
      for (const toast of toasts) {
        if (!timers.has(toast.id)) {
          timers.set(
            toast.id,
            setTimeout(() => {
              timers.delete(toast.id);
              dismiss(toast.id);
            }, AUTO_DISMISS_MS),
          );
        }
      }
      // Toast retiré autrement (fermeture manuelle) : on annule son timer devenu inutile.
      for (const [id, timer] of timers) {
        if (!toasts.some((toast) => toast.id === id)) {
          clearTimeout(timer);
          timers.delete(id);
        }
      }
    }, [toasts, dismiss]);

    useEffect(() => {
      const timers = timersRef.current;
      return () => {
        timers.forEach(clearTimeout);
        timers.clear();
      };
    }, []);

    return { toasts, dismiss };
  };

  return { toastSlice, pushToast, dismissToast, useToasts };
};
