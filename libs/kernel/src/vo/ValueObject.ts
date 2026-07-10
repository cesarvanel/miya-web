/**
 * Base class for immutable Value Objects.
 *
 * Value Objects are NOT stored in Redux (state stays 100% serializable):
 * slices hold the primitive (`toJSON()` output) and selectors/views rebuild
 * the Value Object with the concrete `from` factory when behavior is needed.
 */
export abstract class ValueObject<TValue> {
  protected constructor(protected readonly value: TValue) {}

  /** Structural equality: same concrete class and same underlying value. */
  equals(other: ValueObject<TValue> | null | undefined): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (other.constructor !== this.constructor) {
      return false;
    }
    return other.value === this.value;
  }

  /** Serializable representation, safe to store in Redux slices. */
  toJSON(): TValue {
    return this.value;
  }
}
