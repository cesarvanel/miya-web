import { ValueObject } from './ValueObject';

/**
 * Cameroonian mobile phone number (9 digits, starting with 6).
 * Accepts local and international inputs ("+237...", "237...", "00237...",
 * with spaces, dots, dashes or parentheses) and normalizes to the 9 digits.
 */
export class PhoneNumber extends ValueObject<string> {
  private constructor(digits: string) {
    super(digits);
  }

  static from(input: string): PhoneNumber {
    const compact = input.replace(/[\s.\-()]/g, '').replace(/^\+/, '');
    const national = compact.replace(/^(?:00)?237/, '');
    if (!/^6\d{8}$/.test(national)) {
      throw new Error(`Invalid Cameroonian mobile phone number: ${input}`);
    }
    return new PhoneNumber(national);
  }

  get digits(): string {
    return this.value;
  }

  /** "6 90 12 34 56" */
  format(): string {
    const v = this.value;
    return `${v.slice(0, 1)} ${v.slice(1, 3)} ${v.slice(3, 5)} ${v.slice(5, 7)} ${v.slice(7, 9)}`;
  }

  /** "+237 6 90 12 34 56" */
  formatInternational(): string {
    return `+237 ${this.format()}`;
  }
}
