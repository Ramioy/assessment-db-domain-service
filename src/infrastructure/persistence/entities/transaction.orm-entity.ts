import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'customer_id' })
  customerId: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  cut: string | null;

  @Column({ name: 'transaction_status_id' })
  transactionStatusId: number;

  @ManyToOne('CustomerOrmEntity', 'transactions', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_id' })
  customer: unknown;

  @ManyToOne('TransactionStatusOrmEntity', 'transactions', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'transaction_status_id' })
  status: unknown;

  @OneToMany('DeliveryOrmEntity', 'transaction')
  deliveries: unknown[];
}
