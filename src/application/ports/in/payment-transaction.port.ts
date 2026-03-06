import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import {
  type CreatePaymentTransactionDto,
  type UpdatePaymentTransactionDto,
} from '@domain/models/payment-transaction.entity';
import { type Result } from '@shared/result';
import { type AppError } from '@domain/errors';

export interface PaymentTransactionInputPort {
  create(dto: CreatePaymentTransactionDto): Promise<Result<PaymentTransaction, AppError>>;
  findById(id: string): Promise<Result<PaymentTransaction, AppError>>;
  findByReference(reference: string): Promise<Result<PaymentTransaction, AppError>>;
  findByProviderId(providerId: string): Promise<Result<PaymentTransaction, AppError>>;
  findAll(): Promise<Result<PaymentTransaction[], AppError>>;
  updateStatus(
    id: string,
    dto: UpdatePaymentTransactionDto,
  ): Promise<Result<PaymentTransaction, AppError>>;
}
