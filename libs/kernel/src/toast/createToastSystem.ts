import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
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
    return { toasts, dismiss };
  };

  return { toastSlice, pushToast, dismissToast, useToasts };
};
