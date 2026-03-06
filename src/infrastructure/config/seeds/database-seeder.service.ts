import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeederService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async onApplicationBootstrap(): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

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

      await queryRunner.query(`
        INSERT INTO customer_document_types (name, description)
        VALUES
          ('CC',  'Cédula de Ciudadanía — Colombian national ID'),
          ('CE',  'Cédula de Extranjería — Foreign resident ID'),
          ('NIT', 'Número de Identificación Tributaria — Tax ID'),
          ('PP',  'Pasaporte — Passport'),
          ('TI',  'Tarjeta de Identidad — Identity card for minors'),
          ('DNI', 'Documento Nacional de Identidad — National ID (general)')
        ON CONFLICT DO NOTHING
      `);

      await queryRunner.commitTransaction();
      this.logger.log('Seed completed successfully.');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Seed failed, rolling back:', err);
    } finally {
      await queryRunner.release();
    }
  }
}
