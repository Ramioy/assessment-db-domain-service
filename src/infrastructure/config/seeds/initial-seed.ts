import 'reflect-metadata';
import { AppDataSource } from '../data-source';

async function seed(): Promise<void> {
  await AppDataSource.initialize();
  const queryRunner = AppDataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // ── Transaction Statuses ──────────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO transaction_statuses (name, description)
      VALUES
        ('PENDING',   'Transaction has been created and is awaiting processing'),
        ('APPROVED',  'Transaction has been approved and payment confirmed'),
        ('DECLINED',  'Transaction was declined by the payment provider'),
        ('VOIDED',    'Transaction was voided before processing completed'),
        ('ERROR',     'An error occurred during transaction processing')
      ON CONFLICT (name) DO NOTHING
    `);

    // ── Customer Document Types ───────────────────────────────────────────
    await queryRunner.query(`
      INSERT INTO customer_document_types (name, description)
      VALUES
        ('CC',       'Cédula de Ciudadanía — Colombian national ID'),
        ('CE',       'Cédula de Extranjería — Foreign resident ID'),
        ('NIT',      'Número de Identificación Tributaria — Tax ID'),
        ('PP',       'Pasaporte — Passport'),
        ('TI',       'Tarjeta de Identidad — Identity card for minors'),
        ('DNI',      'Documento Nacional de Identidad — National ID (general)')
      ON CONFLICT DO NOTHING
    `);

    await queryRunner.commitTransaction();
    console.log('Seed completed successfully.');
  } catch (err) {
    await queryRunner.rollbackTransaction();
    console.error('Seed failed, rolling back:', err);
    process.exit(1);
  } finally {
    await queryRunner.release();
    await AppDataSource.destroy();
  }
}

seed();
