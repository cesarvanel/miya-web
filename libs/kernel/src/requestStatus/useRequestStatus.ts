import { useSelector } from 'react-redux';
import {
  requestStatusSlice,
  type RequestStatusEntry,
  type RequestStatus,
  type RequestStatusState,
} from './requestStatusSlice';

const IDLE_ENTRY: RequestStatusEntry = { status: 'idle', error: null };

export interface UseRequestStatusResult {
  status: RequestStatus;
  error: unknown;
  isIdle: boolean;
  isPending: boolean;
  isFulfilled: boolean;
  isRejected: boolean;
}

/** Reads the lifecycle of an async thunk (`useRequestStatus(loadAgents)`). */
export const useRequestStatus = (thunk: {
  typePrefix: string;
}): UseRequestStatusResult => {
  const entry = useSelector((state: unknown): RequestStatusEntry => {
    const sliceState = (state as Record<string, RequestStatusState | undefined>)[
      requestStatusSlice.name
    ];
    return sliceState?.byTypePrefix[thunk.typePrefix] ?? IDLE_ENTRY;
  });
  return {
    status: entry.status,
    error: entry.error,
    isIdle: entry.status === 'idle',
    isPending: entry.status === 'pending',
    isFulfilled: entry.status === 'fulfilled',
    isRejected: entry.status === 'rejected',
  };
};
