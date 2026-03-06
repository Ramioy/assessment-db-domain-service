import { z } from 'zod';
import { baseSchema } from '@shared/base.entity';
// ─────────────────────────────────────────────
//  Entity
// ─────────────────────────────────────────────
export class Delivery {
  readonly id: number;
  readonly uuid: string;
  readonly customerId: number;
  /**
   * customer_address_id — references a customer address record.
   * If a separate CustomerAddress entity exists, add the relation here.
   */
  readonly customerAddressId: number | null;
  readonly transactionId: number;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  private constructor(props: DeliveryDto) {
    this.id = props.id;
    this.uuid = props.uuid;
    this.customerId = props.customerId;
    this.customerAddressId = props.customerAddressId ?? null;
    this.transactionId = props.transactionId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  static create(dto: CreateDeliveryDto): Delivery {
    const now = new Date();
    return new Delivery({
      id: 0,
      uuid: '', // assigned by DB
      customerId: dto.customerId,
      customerAddressId: dto.customerAddressId ?? null,
      transactionId: dto.transactionId,
      createdAt: now,
      updatedAt: now,
    });
  }

  static fromPersistence(props: DeliveryDto): Delivery {
    return new Delivery(props);
  }
}

// ─────────────────────────────────────────────
//  Zod Schemas
// ─────────────────────────────────────────────
export const deliverySchema = baseSchema.extend({
  uuid: z.string().uuid(),
  customerId: z.number().int().positive(),
  customerAddressId: z.number().int().positive().nullable().optional(),
  transactionId: z.number().int().positive(),
});

export const createDeliverySchema = deliverySchema.omit({
  id: true,
  uuid: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDeliverySchema = createDeliverySchema.partial();

export type DeliveryDto = z.infer<typeof deliverySchema>;
export type CreateDeliveryDto = z.infer<typeof createDeliverySchema>;
export type UpdateDeliveryDto = z.infer<typeof updateDeliverySchema>;
