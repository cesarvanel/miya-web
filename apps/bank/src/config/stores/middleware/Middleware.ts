import type { Middleware, UnknownAction } from '@reduxjs/toolkit';
import type { BankDependencies } from '@/config/stores/dependencies/dependencies';
import type { RealtimeClient } from '@/config/stores/socket/realtime';


export interface BankMiddlewareContext {
  dependencies: BankDependencies;
  realtimeClient: RealtimeClient;
}


export const createRealtimeMiddleware =
  (realtimeClient: RealtimeClient): Middleware =>
  (api) => {
    realtimeClient.on((event) => {
      api.dispatch({ type: event.type, payload: event.payload } as UnknownAction);
    });
    return (next) => (action) => next(action);
  };

export const makeBankMiddlewares = (
  context: BankMiddlewareContext,
): Middleware[] => [createRealtimeMiddleware(context.realtimeClient)];
