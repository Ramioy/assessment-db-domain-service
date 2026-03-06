import { z } from 'zod';

// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class PaymentTransaction {
  readonly id: string;
  readonly providerId: string | null;
  readonly reference: string;
  readonly amountInCents: number;
  readonly currency: string;
  readonly status: string;
  readonly statusMessage: string | null;
  readonly paymentMethod: string;
  readonly customerEmail: string;
  readonly customerIp: string | null;
  readonly signature: string;
  readonly providerResponse: Record<string, unknown> | null;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: PaymentTransactionDto) {
    this.id = props.id;
    this.providerId = props.providerId;
    this.reference = props.reference;
    this.amountInCents = props.amountInCents;
    this.currency = props.currency;
    this.status = props.status;
    this.statusMessage = props.statusMessage;
    this.paymentMethod = props.paymentMethod;
    this.customerEmail = props.customerEmail;
    this.customerIp = props.customerIp;
    this.signature = props.signature;
    this.providerResponse = props.providerResponse;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreatePaymentTransactionDto): PaymentTransaction {
    const now = new Date();
    return new PaymentTransaction({
      id: dto.id,
      providerId: dto.providerId ?? null,
      reference: dto.reference,
      amountInCents: dto.amountInCents,
      currency: dto.currency,
      status: dto.status ?? 'PENDING',
      statusMessage: dto.statusMessage ?? null,
      paymentMethod: dto.paymentMethod,
      customerEmail: dto.customerEmail,
      customerIp: dto.customerIp ?? null,
      signature: dto.signature,
      providerResponse: dto.providerResponse ?? null,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: PaymentTransactionDto): PaymentTransaction {
    return new PaymentTransaction(props);
  }

  applyStatusUpdate(dto: UpdatePaymentTransactionDto): PaymentTransaction {
    return new PaymentTransaction({
      id: this.id,
      providerId: dto.providerId !== undefined ? dto.providerId : this.providerId,
      reference: this.reference,
      amountInCents: this.amountInCents,
      currency: this.currency,
      status: dto.status ?? this.status,
      statusMessage: dto.statusMessage !== undefined ? dto.statusMessage : this.statusMessage,
      paymentMethod: this.paymentMethod,
      customerEmail: this.customerEmail,
      customerIp: this.customerIp,
      signature: this.signature,
      providerResponse:
        dto.providerResponse !== undefined ? dto.providerResponse : this.providerResponse,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const paymentTransactionSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  providerId: z.string().nullable(),
  reference: z.string().min(1).max(255),
  amountInCents: z.number().int().positive(),
  currency: z.string().length(3),
  status: z.string().min(1).max(50),
  statusMessage: z.string().max(500).nullable(),
  paymentMethod: z.string().min(1).max(50),
  customerEmail: z.string().email().max(255),
  customerIp: z.string().max(45).nullable(),
  signature: z.string().min(1).max(128),
  providerResponse: z.record(z.string(), z.unknown()).nullable(),
});

export const createPaymentTransactionSchema = paymentTransactionSchema.omit({
  createdAt: true,
  updatedAt: true,
});

export const updatePaymentTransactionSchema = paymentTransactionSchema
  .pick({
    providerId: true,
    status: true,
    statusMessage: true,
    providerResponse: true,
  })
  .partial();

export type PaymentTransactionDto = z.infer<typeof paymentTransactionSchema>;
export type CreatePaymentTransactionDto = z.infer<typeof createPaymentTransactionSchema>;
export type UpdatePaymentTransactionDto = z.infer<typeof updatePaymentTransactionSchema>;
