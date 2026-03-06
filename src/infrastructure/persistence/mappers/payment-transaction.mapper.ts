import { PaymentTransaction } from '@domain/models/payment-transaction.entity';
import { PaymentTransactionOrmEntity } from '../entities/payment-transaction.orm-entity';

export class PaymentTransactionMapper {
  static toDomain(orm: PaymentTransactionOrmEntity): PaymentTransaction {
    return PaymentTransaction.fromPersistence({
      id: orm.id,
      providerId: orm.providerId,
      reference: orm.reference,
      amountInCents: Number(orm.amountInCents), // bigint string -> number
      currency: orm.currency,
      status: orm.status,
      statusMessage: orm.statusMessage,
      paymentMethod: orm.paymentMethod,
      customerEmail: orm.customerEmail,
      customerIp: orm.customerIp,
      signature: orm.signature,
      providerResponse: orm.providerResponse,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toOrm(entity: PaymentTransaction): PaymentTransactionOrmEntity {
    const orm = new PaymentTransactionOrmEntity();
    orm.id = entity.id;
    orm.providerId = entity.providerId ?? null;
    orm.reference = entity.reference;
    orm.amountInCents = String(entity.amountInCents); // number -> bigint string
    orm.currency = entity.currency;
    orm.status = entity.status;
    orm.statusMessage = entity.statusMessage ?? null;
    orm.paymentMethod = entity.paymentMethod;
    orm.customerEmail = entity.customerEmail;
    orm.customerIp = entity.customerIp ?? null;
    orm.signature = entity.signature;
    orm.providerResponse = entity.providerResponse ?? null;
    return orm;
  }
}
