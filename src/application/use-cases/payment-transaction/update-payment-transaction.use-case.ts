import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import {
  PaymentTransaction,
  type UpdatePaymentTransactionDto,
} from '@domain/models/payment-transaction.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { PaymentTransactionRepositoryPort } from '@application/ports/out/payment-transaction-repository.port';
import { err, type Result } from '@shared/result';

@Injectable()
export class UpdatePaymentTransactionUseCase {
  constructor(
    @Inject(DI_TOKENS.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly repository: PaymentTransactionRepositoryPort,
  ) {}

  async execute(
    id: string,
    dto: UpdatePaymentTransactionDto,
  ): Promise<Result<PaymentTransaction, AppError>> {
    const found = await this.repository.findById(id);
    if (!found.ok) return found;
    if (!found.value) return err(new NotFoundError('PaymentTransaction', id));

    const updated = found.value.applyStatusUpdate(dto);
    return this.repository.save(updated);
  }
}
