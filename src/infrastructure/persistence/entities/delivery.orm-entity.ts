import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('deliveries')
export class DeliveryOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ name: 'customer_address_id', type: 'int', nullable: true })
  customerAddressId: number | null;

  @Column({ name: 'transaction_id' })
  transactionId: number;

  @ManyToOne('CustomerOrmEntity', 'deliveries', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: unknown;

  @ManyToOne('TransactionOrmEntity', 'deliveries', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'transaction_id' })
  transaction: unknown;
}
