/** Serializable error shape stored via `rejectWithValue` in every use case. */
export interface ErrorState {
  message: string;
}

const DEFAULT_MESSAGE = 'Une erreur est survenue.';

/** Normalizes any thrown value into a serializable, Redux-safe error state. */
export const getErrorState = (error: unknown): ErrorState => {
  if (error instanceof Error) {
    return { message: error.message || DEFAULT_MESSAGE };
  }
  if (typeof error === 'string' && error.trim() !== '') {
    return { message: error };
  }
  return { message: DEFAULT_MESSAGE };
};
