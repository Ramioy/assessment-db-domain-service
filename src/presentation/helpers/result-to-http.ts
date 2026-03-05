import {
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { type Result } from '@shared/result';
import {
  NotFoundError,
  AlreadyExistsError,
  InsufficientStockError,
  InvalidTransactionError,
  InfrastructureError,
  type DomainError,
} from '@domain/errors';

export function unwrapResult<T>(result: Result<T, DomainError>): T {
  if (result.ok) return result.value;

  const { error } = result;
  if (error instanceof NotFoundError) throw new NotFoundException(error.message);
  if (error instanceof AlreadyExistsError) throw new ConflictException(error.message);
  if (error instanceof InsufficientStockError)
    throw new UnprocessableEntityException(error.message);
  if (error instanceof InvalidTransactionError) throw new BadRequestException(error.message);
  if (error instanceof InfrastructureError) throw new InternalServerErrorException(error.message);

  throw new InternalServerErrorException('Unexpected error');
}
