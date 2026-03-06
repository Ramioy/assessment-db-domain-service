import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import {
  PaymentTransaction,
  type CreatePaymentTransactionDto,
} from '@domain/models/payment-transaction.entity';
import { AlreadyExistsError, type AppError } from '@domain/errors';
import { PaymentTransactionRepositoryPort } from '@application/ports/out/payment-transaction-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class CreatePaymentTransactionUseCase {
  constructor(
    @Inject(DI_TOKENS.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly repository: PaymentTransactionRepositoryPort,
  ) {}

  async execute(dto: CreatePaymentTransactionDto): Promise<Result<PaymentTransaction, AppError>> {
    const existing = await this.repository.findByReference(dto.reference);
    if (!existing.ok) return existing;
    if (existing.value) {
      return err(new AlreadyExistsError('PaymentTransaction', 'reference', dto.reference));
    }

    const entity = PaymentTransaction.create(dto);
    return this.repository.save(entity);
  }
}
