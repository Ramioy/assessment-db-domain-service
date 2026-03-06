import { Injectable, Inject } from '@nestjs/common';
import { DI_TOKENS } from '@shared/di-tokens';
import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { type AppError } from '@domain/errors';
import { PaymentTransactionRepositoryPort } from '@application/ports/out/payment-transaction-repository.port';
import { type Result } from '@shared/result';

@Injectable()
export class FindAllPaymentTransactionsUseCase {
  constructor(
    @Inject(DI_TOKENS.PAYMENT_TRANSACTION_REPOSITORY)
    private readonly repository: PaymentTransactionRepositoryPort,
  ) {}

  async execute(): Promise<Result<PaymentTransaction[], AppError>> {
    return this.repository.findAll();
  }
}
