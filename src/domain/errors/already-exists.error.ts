export class AlreadyExistsError {
  readonly code = 'ALREADY_EXISTS' as const;
  readonly message: string;

  constructor(
    readonly entity: string,
    readonly field: string,
    readonly value: string,
  ) {
    this.message = `${entity} with ${field} '${value}' already exists`;
  }
}
