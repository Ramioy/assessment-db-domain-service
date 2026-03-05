export class NotFoundError {
  readonly code = 'NOT_FOUND' as const;
  readonly message: string;

  constructor(
    readonly entity: string,
    readonly id: number | string,
  ) {
    this.message = `${entity} with id ${id} not found`;
  }
}
