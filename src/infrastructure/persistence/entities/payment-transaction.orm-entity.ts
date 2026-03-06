import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('payment_transactions')
export class PaymentTransactionOrmEntity {
  @PrimaryColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'provider_id', type: 'varchar', length: 100, nullable: true })
  providerId: string | null;

  @Column({ name: 'reference', type: 'varchar', length: 255, unique: true })
  reference: string;

  @Column({ name: 'amount_in_cents', type: 'bigint' })
  amountInCents: string; // TypeORM returns bigint as string

  @Column({ name: 'currency', type: 'varchar', length: 3, default: 'COP' })
  currency: string;

  @Column({ name: 'status', type: 'varchar', length: 50, default: 'PENDING' })
  status: string;

  @Column({ name: 'status_message', type: 'varchar', length: 500, nullable: true })
  statusMessage: string | null;

  @Column({ name: 'payment_method', type: 'varchar', length: 50 })
  paymentMethod: string;

  @Column({ name: 'customer_email', type: 'varchar', length: 255 })
  customerEmail: string;

  @Column({ name: 'customer_ip', type: 'varchar', length: 45, nullable: true })
  customerIp: string | null;

  @Column({ name: 'signature', type: 'varchar', length: 128 })
  signature: string;

  @Column({ name: 'provider_response', type: 'jsonb', nullable: true })
  providerResponse: Record<string, unknown> | null;
}
