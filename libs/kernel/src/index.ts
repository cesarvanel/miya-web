// Value Objects (never stored in Redux — rebuilt in selectors/views)
export * from './vo/ValueObject';
export * from './vo/Money';
export * from './vo/PhoneNumber';

// Declarative cache for async thunks
export * from './cache/cacheSlice';
export * from './cache/createCachedAsyncThunk';

// Typed modal system (slice + useModal)
export * from './modals/createModalSystem';

// Typed toast system (slice + useToasts)
export * from './toast/createToastSystem';

// Async thunk lifecycle tracking (slice + useRequestStatus)
export * from './requestStatus/requestStatusSlice';
export * from './requestStatus/useRequestStatus';

// Use case error normalization for rejectWithValue
export * from './errors/getErrorState';

// Realtime data freshness ("il y a 8 s"), keyed off cacheSlice's fetchedAt
export * from './realtime/useFreshness';
