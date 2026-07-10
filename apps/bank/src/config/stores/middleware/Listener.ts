import { addListener, createListenerMiddleware } from '@reduxjs/toolkit';
import {
  bankDependencies,
  type BankDependencies,
} from '@/config/stores/dependencies/dependencies';
import type { BankDispatch, BankRootState } from '@/config/stores/store';

export const bankListenerMiddleware = createListenerMiddleware({
  extra: bankDependencies,
});

export const startBankListening = bankListenerMiddleware.startListening.withTypes<
  BankRootState,
  BankDispatch,
  BankDependencies
>();

export const addBankListener = addListener.withTypes<
  BankRootState,
  BankDispatch,
  BankDependencies
>();

export const clearBankListeners = (): void =>
  bankListenerMiddleware.clearListeners();
