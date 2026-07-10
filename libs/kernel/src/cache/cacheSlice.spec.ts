import {
  cacheSlice,
  cacheSliceFactory,
  invalidateTags,
  markFetched,
} from './cacheSlice';

describe('cacheSlice', () => {
  describe('markFetched', () => {
    it('stores the entry with its tags and fetchedAt', () => {
      const state = cacheSlice.reducer(
        undefined,
        markFetched({ key: 'agents:list', tags: ['agents'], fetchedAt: 1000 }),
      );
      expect(state.entries['agents:list']).toEqual({
        fetchedAt: 1000,
        tags: ['agents'],
      });
    });

    it('defaults fetchedAt to now and tags to []', () => {
      vi.useFakeTimers();
      vi.setSystemTime(5000);
      const state = cacheSlice.reducer(
        undefined,
        markFetched({ key: 'agents:list' }),
      );
      expect(state.entries['agents:list']).toEqual({
        fetchedAt: 5000,
        tags: [],
      });
      vi.useRealTimers();
    });

    it('overwrites an existing entry for the same key', () => {
      let state = cacheSlice.reducer(
        undefined,
        markFetched({ key: 'k', tags: ['a'], fetchedAt: 1 }),
      );
      state = cacheSlice.reducer(
        state,
        markFetched({ key: 'k', tags: ['b'], fetchedAt: 2 }),
      );
      expect(state.entries['k']).toEqual({ fetchedAt: 2, tags: ['b'] });
    });
  });

  describe('invalidateTags', () => {
    it('removes only entries sharing at least one tag', () => {
      let state = cacheSlice.reducer(
        undefined,
        markFetched({ key: 'agents:list', tags: ['agents'], fetchedAt: 1 }),
      );
      state = cacheSlice.reducer(
        state,
        markFetched({
          key: 'settlements:queue',
          tags: ['settlements'],
          fetchedAt: 1,
        }),
      );
      state = cacheSlice.reducer(state, invalidateTags(['agents']));
      expect(state.entries['agents:list']).toBeUndefined();
      expect(state.entries['settlements:queue']).toBeDefined();
    });

    it('leaves untagged entries alone', () => {
      let state = cacheSlice.reducer(
        undefined,
        markFetched({ key: 'k', fetchedAt: 1 }),
      );
      state = cacheSlice.reducer(state, invalidateTags(['anything']));
      expect(state.entries['k']).toBeDefined();
    });
  });

  describe('cacheSliceFactory', () => {
    it('allows a custom slice name', () => {
      const custom = cacheSliceFactory('customCache');
      expect(custom.actions.markFetched({ key: 'k' }).type).toBe(
        'customCache/markFetched',
      );
    });
  });
});
