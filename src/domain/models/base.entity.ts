import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { z } from 'zod';

// ─────────────────────────────────────────────
//  Base Entity
// ─────────────────────────────────────────────
export abstract class BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}

// ─────────────────────────────────────────────
//  Base Zod Schema  (reusable fragment)
// ─────────────────────────────────────────────
export const baseSchema = z.object({
  id: z.number().int().positive(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
