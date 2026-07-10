import { ValueObject } from './ValueObject';

/**
 * Amount of money in FCFA. FCFA has no sub-unit, so amounts are integers.
 * Immutable: arithmetic methods return new instances.
 */
export class Money extends ValueObject<number> {
  private constructor(amount: number) {
    super(amount);
  }

  static from(amount: number): Money {
    if (!Number.isSafeInteger(amount)) {
      throw new Error(
        `Money amount must be an integer number of FCFA, received: ${amount}`,
      );
    }
    return new Money(amount);
  }

  get amount(): number {
    return this.value;
  }

  add(other: Money): Money {
    return Money.from(this.value + other.value);
  }

  subtract(other: Money): Money {
    return Money.from(this.value - other.value);
  }

  gte(other: Money): boolean {
    return this.value >= other.value;
  }

  /**
   * Ratio of this amount over `other` (e.g. `collected.ratioOf(expected)`
   * → 0.75 for a progress indicator). Returns 0 when `other` is zero.
   */
  ratioOf(other: Money): number {
    if (other.value === 0) {
      return 0;
    }
    return this.value / other.value;
  }

  /** "127 500 FCFA" — fr-FR thousands grouping, normalized to regular spaces. */
  format(): string {
    const grouped = new Intl.NumberFormat('fr-FR')
      .format(this.value)
      // Intl fr-FR groups with narrow no-break spaces; normalize to plain
      // spaces so output matches the design spec and stays test-friendly.
      .replace(/[\u202F\u00A0]/g, ' ');
    return `${grouped} FCFA`;
  }
}
