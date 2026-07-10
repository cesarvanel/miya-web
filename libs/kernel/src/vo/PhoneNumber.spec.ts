import { PhoneNumber } from './PhoneNumber';

describe('PhoneNumber', () => {
  describe('from', () => {
    it('accepts a bare 9-digit mobile number', () => {
      expect(PhoneNumber.from('690123456').digits).toBe('690123456');
    });

    it('normalizes international and formatted inputs', () => {
      expect(PhoneNumber.from('+237690123456').digits).toBe('690123456');
      expect(PhoneNumber.from('237690123456').digits).toBe('690123456');
      expect(PhoneNumber.from('00237690123456').digits).toBe('690123456');
      expect(PhoneNumber.from('+237 6 90 12 34 56').digits).toBe('690123456');
      expect(PhoneNumber.from('6 90-12-34-56').digits).toBe('690123456');
      expect(PhoneNumber.from('6.90.12.34.56').digits).toBe('690123456');
    });

    it('rejects invalid numbers', () => {
      expect(() => PhoneNumber.from('790123456')).toThrow(/Invalid/); // not a 6xx mobile
      expect(() => PhoneNumber.from('69012345')).toThrow(/Invalid/); // 8 digits
      expect(() => PhoneNumber.from('6901234567')).toThrow(/Invalid/); // 10 digits
      expect(() => PhoneNumber.from('abcdefghi')).toThrow(/Invalid/);
      expect(() => PhoneNumber.from('')).toThrow(/Invalid/);
    });
  });

  describe('format', () => {
    it('formats as "6 XX XX XX XX"', () => {
      expect(PhoneNumber.from('690123456').format()).toBe('6 90 12 34 56');
    });

    it('formats the international variant', () => {
      expect(PhoneNumber.from('690123456').formatInternational()).toBe(
        '+237 6 90 12 34 56',
      );
    });
  });

  describe('toJSON', () => {
    it('serializes to the normalized digits', () => {
      expect(JSON.stringify(PhoneNumber.from('+237 690123456'))).toBe(
        '"690123456"',
      );
    });
  });

  describe('equals', () => {
    it('compares normalized values', () => {
      expect(
        PhoneNumber.from('+237690123456').equals(PhoneNumber.from('690123456')),
      ).toBe(true);
      expect(
        PhoneNumber.from('690123456').equals(PhoneNumber.from('690123457')),
      ).toBe(false);
    });
  });
});
