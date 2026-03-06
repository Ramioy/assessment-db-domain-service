import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentTransactions1741305600000 implements MigrationInterface {
  name = 'AddPaymentTransactions1741305600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "payment_transactions" (
        "id"                UUID           NOT NULL DEFAULT gen_random_uuid(),
        "created_at"        TIMESTAMPTZ    NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMPTZ    NOT NULL DEFAULT now(),
        "provider_id"       VARCHAR(100)   NULL,
        "reference"         VARCHAR(255)   NOT NULL,
        "amount_in_cents"   BIGINT         NOT NULL,
        "currency"          VARCHAR(3)     NOT NULL DEFAULT 'COP',
        "status"            VARCHAR(50)    NOT NULL DEFAULT 'PENDING',
        "status_message"    VARCHAR(500)   NULL,
        "payment_method"    VARCHAR(50)    NOT NULL,
        "customer_email"    VARCHAR(255)   NOT NULL,
        "customer_ip"       VARCHAR(45)    NULL,
        "signature"         VARCHAR(128)   NOT NULL,
        "provider_response" JSONB          NULL,
        CONSTRAINT "PK_payment_transactions"           PRIMARY KEY ("id"),
        CONSTRAINT "UQ_payment_transactions_reference" UNIQUE ("reference")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_payment_transactions_reference"   ON "payment_transactions" ("reference")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payment_transactions_status"      ON "payment_transactions" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payment_transactions_provider_id" ON "payment_transactions" ("provider_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "payment_transactions"`);
  }
}
