import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { type Result } from '@shared/result';
import { type InfrastructureError } from '@shared/errors';

export interface PaymentTransactionRepositoryPort {
  findById(id: string): Promise<Result<PaymentTransaction | null, InfrastructureError>>;
  findByReference(
    reference: string,
  ): Promise<Result<PaymentTransaction | null, InfrastructureError>>;
  findByProviderId(
    providerId: string,
  ): Promise<Result<PaymentTransaction | null, InfrastructureError>>;
  findAll(): Promise<Result<PaymentTransaction[], InfrastructureError>>;
  save(entity: PaymentTransaction): Promise<Result<PaymentTransaction, InfrastructureError>>;
}
