// @ts-nocheck
/* eslint-disable */
import {
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { unwrapResult } from '@presentation/helpers/result-to-http';
import { ok, err } from '@shared/result';
import { InfrastructureError } from '@shared/errors';
import {
  NotFoundError,
  AlreadyExistsError,
  InsufficientStockError,
  InvalidTransactionError,
} from '@domain/errors';

describe('unwrapResult()', () => {
  it('returns value when result is ok', () => {
    const result = ok({ id: 1, name: 'test' });

    const value = unwrapResult(result);

    expect(value).toEqual({ id: 1, name: 'test' });
  });

  it('throws NotFoundException for NotFoundError', () => {
    const error = new NotFoundError('Customer with id 1 not found');
    const result = err(error);

    expect(() => unwrapResult(result)).toThrow(NotFoundException);
    expect(() => unwrapResult(result)).toThrow('Customer with id 1 not found');
  });

  it('throws ConflictException for AlreadyExistsError', () => {
    const error = new AlreadyExistsError('Email already exists');
    const result = err(error);

    expect(() => unwrapResult(result)).toThrow(ConflictException);
    expect(() => unwrapResult(result)).toThrow('Email already exists');
  });

  it('throws UnprocessableEntityException for InsufficientStockError', () => {
    const error = new InsufficientStockError('Insufficient stock for product 1');
    const result = err(error);

    expect(() => unwrapResult(result)).toThrow(UnprocessableEntityException);
    expect(() => unwrapResult(result)).toThrow('Insufficient stock for product 1');
  });

  it('throws BadRequestException for InvalidTransactionError', () => {
    const error = new InvalidTransactionError('Invalid transaction state');
    const result = err(error);

    expect(() => unwrapResult(result)).toThrow(BadRequestException);
    expect(() => unwrapResult(result)).toThrow('Invalid transaction state');
  });

  it('throws InternalServerErrorException for InfrastructureError', () => {
    const error = new InfrastructureError('DB connection failed');
    const result = err(error);

    expect(() => unwrapResult(result)).toThrow(InternalServerErrorException);
    expect(() => unwrapResult(result)).toThrow('DB connection failed');
  });

  it('throws InternalServerErrorException for unknown error type', () => {
    const unknownError = { message: 'some unknown error' } as any;
    const result = err(unknownError);

    expect(() => unwrapResult(result)).toThrow(InternalServerErrorException);
    expect(() => unwrapResult(result)).toThrow('Unexpected error');
  });
});
