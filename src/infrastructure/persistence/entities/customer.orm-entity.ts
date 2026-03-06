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

@Entity('customers')
export class CustomerOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ name: 'customer_document_type_id' })
  customerDocumentTypeId: number;

  @Column({ name: 'document_number', type: 'varchar', length: 50, unique: true })
  documentNumber: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 30, nullable: true })
  contactPhone: string | null;

  @Column({ name: 'address', type: 'text', nullable: true })
  address: string | null;

  @ManyToOne('CustomerDocumentTypeOrmEntity', 'customers', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customer_document_type_id' })
  documentType: unknown;

  @OneToMany('TransactionOrmEntity', 'customer')
  transactions: unknown[];

  @OneToMany('DeliveryOrmEntity', 'customer')
  deliveries: unknown[];
}
