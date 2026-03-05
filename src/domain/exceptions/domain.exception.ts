/**
 * Base Domain Exception
 * Domain-specific errors that represent business rule violations
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}
