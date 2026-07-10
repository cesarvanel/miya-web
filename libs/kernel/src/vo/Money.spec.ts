import { Money } from './Money';

describe('Money', () => {
  describe('from', () => {
    it('creates a Money from an integer amount of FCFA', () => {
      expect(Money.from(127500).amount).toBe(127500);
    });

    it('rejects non-integer amounts', () => {
      expect(() => Money.from(10.5)).toThrow(/integer/);
      expect(() => Money.from(Number.NaN)).toThrow(/integer/);
      expect(() => Money.from(Number.POSITIVE_INFINITY)).toThrow(/integer/);
    });
  });

  describe('add', () => {
    it('returns the sum without mutating operands', () => {
      const a = Money.from(1000);
      const b = Money.from(500);
      expect(a.add(b).amount).toBe(1500);
      expect(a.amount).toBe(1000);
      expect(b.amount).toBe(500);
    });
  });

  describe('subtract', () => {
    it('returns the difference', () => {
      expect(Money.from(1000).subtract(Money.from(400)).amount).toBe(600);
    });

    it('allows negative results (shortfall)', () => {
      expect(Money.from(500).subtract(Money.from(800)).amount).toBe(-300);
    });
  });

  describe('gte', () => {
    it('compares amounts', () => {
      expect(Money.from(1000).gte(Money.from(1000))).toBe(true);
      expect(Money.from(1001).gte(Money.from(1000))).toBe(true);
      expect(Money.from(999).gte(Money.from(1000))).toBe(false);
    });
  });

  describe('ratioOf', () => {
    it('returns the ratio of this amount over the other', () => {
      expect(Money.from(75).ratioOf(Money.from(100))).toBe(0.75);
    });

    it('returns 0 when the other amount is zero', () => {
      expect(Money.from(75).ratioOf(Money.from(0))).toBe(0);
    });
  });

  describe('format', () => {
    it('formats with fr-FR thousands grouping and FCFA suffix', () => {
      expect(Money.from(127500).format()).toBe('127 500 FCFA');
      expect(Money.from(1234567).format()).toBe('1 234 567 FCFA');
    });

    it('formats small and negative amounts', () => {
      expect(Money.from(0).format()).toBe('0 FCFA');
      expect(Money.from(500).format()).toBe('500 FCFA');
      expect(Money.from(-127500).format()).toBe('-127 500 FCFA');
    });
  });

  describe('toJSON', () => {
    it('serializes to the raw integer amount', () => {
      expect(JSON.stringify({ price: Money.from(500) })).toBe('{"price":500}');
    });
  });

  describe('equals', () => {
    it('is true for same amounts, false otherwise', () => {
      expect(Money.from(500).equals(Money.from(500))).toBe(true);
      expect(Money.from(500).equals(Money.from(501))).toBe(false);
      expect(Money.from(500).equals(null)).toBe(false);
      expect(Money.from(500).equals(undefined)).toBe(false);
    });
  });
});
