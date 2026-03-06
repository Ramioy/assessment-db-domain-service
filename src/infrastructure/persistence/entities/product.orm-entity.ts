import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Generated,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

@Entity('products')
export class ProductOrmEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'uuid', unique: true })
  @Generated('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'image_url', type: 'varchar', length: 2048, nullable: true })
  imageUrl: string | null;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne('ProductCategoryOrmEntity', 'products', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'category_id' })
  category: unknown;

  @OneToOne('StockOrmEntity', 'product')
  stock: unknown;
}
