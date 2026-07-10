import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

/** Maps each modal type to its props (use `undefined` for prop-less modals). */
export type ModalPropsMap<TType extends string> = Record<
  TType,
  object | undefined
>;

/** Discriminated union of every openable modal: `{ type, props }`. */
export type OpenModalPayload<
  TType extends string,
  TPropsMap extends ModalPropsMap<TType>,
> = {
  [K in TType]: { type: K; props: TPropsMap[K] };
}[TType];

export interface ModalsState<
  TType extends string,
  TPropsMap extends ModalPropsMap<TType>,
> {
  current: OpenModalPayload<TType, TPropsMap> | null;
}

export interface UseModalResult<TProps> {
  isOpen: boolean;
  props: TProps | undefined;
  close: () => void;
}

/**
 * Builds a typed modal system for an app. Each app instantiates it once in
 * `src/shared` with its own modal enum, mounts `modalsSlice.reducer` under
 * the `modals` store key, and every modal component subscribes with
 * `useModal(type)` — rendering null while `isOpen` is false.
 */
export const createModalSystem = <
  TType extends string,
  TPropsMap extends ModalPropsMap<TType>,
>(
  sliceName = 'modals',
) => {
  type CurrentModal = OpenModalPayload<TType, TPropsMap>;
  type State = ModalsState<TType, TPropsMap>;

  const initialState: State = { current: null };

  const modalsSlice = createSlice({
    name: sliceName,
    initialState,
    reducers: {
      openModal: (_state, action: PayloadAction<CurrentModal>): State => ({
        current: action.payload,
      }),
      closeModal: (): State => ({ current: null }),
    },
  });

  const { openModal, closeModal } = modalsSlice.actions;

  const selectCurrent = (state: unknown): CurrentModal | null => {
    const sliceState = (state as Record<string, State | undefined>)[sliceName];
    return sliceState?.current ?? null;
  };

  const useModal = <K extends TType>(type: K): UseModalResult<TPropsMap[K]> => {
    const dispatch = useDispatch();
    const current = useSelector(selectCurrent);
    const close = useCallback(() => {
      dispatch(closeModal());
    }, [dispatch]);
    const isOpen = current !== null && current.type === type;
    return {
      isOpen,
      props: isOpen ? (current.props as TPropsMap[K]) : undefined,
      close,
    };
  };

  return { modalsSlice, openModal, closeModal, useModal };
};
