import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { NotFoundError, type AppError } from '@domain/errors';
import { PaymentTransactionRepositoryPort } from '@application/ports/out/payment-transaction-repository.port';
import { ok, err, type Result } from '@shared/result';

@Injectable()
export class FindPaymentTransactionUseCase {
  constructor(
    @Inject(DI_TOKENS.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly repository: PaymentTransactionRepositoryPort,
  ) {}

  async execute(id: string): Promise<Result<PaymentTransaction, AppError>> {
    const result = await this.repository.findById(id);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('PaymentTransaction', id));
    return ok(result.value);
  }

  async executeByReference(reference: string): Promise<Result<PaymentTransaction, AppError>> {
    const result = await this.repository.findByReference(reference);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('PaymentTransaction', reference));
    return ok(result.value);
  }

  async executeByProviderId(providerId: string): Promise<Result<PaymentTransaction, AppError>> {
    const result = await this.repository.findByProviderId(providerId);
    if (!result.ok) return result;
    if (!result.value) return err(new NotFoundError('PaymentTransaction', providerId));
    return ok(result.value);
  }
}
