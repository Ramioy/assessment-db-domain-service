export {
  createPaymentTransactionSchema as createPaymentTransactionRequestSchema,
  updatePaymentTransactionSchema as updatePaymentTransactionRequestSchema,
  paymentTransactionSchema as paymentTransactionResponseSchema,
} from '@domain/models/payment-transaction.entity';

export type {
  CreatePaymentTransactionDto as CreatePaymentTransactionRequestDto,
  UpdatePaymentTransactionDto as UpdatePaymentTransactionRequestDto,
  PaymentTransactionDto as PaymentTransactionResponseDto,
} from '@domain/models/payment-transaction.entity';
