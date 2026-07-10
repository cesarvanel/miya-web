import { getErrorState } from './getErrorState';

describe('getErrorState', () => {
  it('extracts the message from an Error instance', () => {
    expect(getErrorState(new Error('network down'))).toEqual({
      message: 'network down',
    });
  });

  it('passes through a non-empty string as-is', () => {
    expect(getErrorState('gateway unreachable')).toEqual({
      message: 'gateway unreachable',
    });
  });

  it('falls back to a default message for unknown shapes', () => {
    expect(getErrorState({ weird: true })).toEqual({
      message: 'Une erreur est survenue.',
    });
    expect(getErrorState(undefined)).toEqual({
      message: 'Une erreur est survenue.',
    });
    expect(getErrorState('')).toEqual({ message: 'Une erreur est survenue.' });
  });

  it('falls back when an Error has an empty message', () => {
    expect(getErrorState(new Error(''))).toEqual({
      message: 'Une erreur est survenue.',
    });
  });
});
