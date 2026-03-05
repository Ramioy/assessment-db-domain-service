import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1700000000000 implements MigrationInterface {
  name = 'InitialSchema1700000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // product_categories
    await queryRunner.query(`
      CREATE TABLE "product_categories" (
        "id"          SERIAL                   NOT NULL,
        "created_at"  TIMESTAMPTZ              NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ              NOT NULL DEFAULT now(),
        "name"        CHARACTER VARYING(255)   NOT NULL,
        "description" TEXT,
        CONSTRAINT "PK_product_categories" PRIMARY KEY ("id")
      )
    `);

    // products
    await queryRunner.query(`
      CREATE TABLE "products" (
        "id"          SERIAL                   NOT NULL,
        "created_at"  TIMESTAMPTZ              NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ              NOT NULL DEFAULT now(),
        "uuid"        UUID                     NOT NULL DEFAULT uuid_generate_v4(),
        "name"        CHARACTER VARYING(255)   NOT NULL,
        "description" TEXT,
        "image_url"   CHARACTER VARYING(2048),
        "category_id" INTEGER                  NOT NULL,
        CONSTRAINT "UQ_products_uuid"          UNIQUE ("uuid"),
        CONSTRAINT "PK_products"               PRIMARY KEY ("id"),
        CONSTRAINT "FK_products_category"
          FOREIGN KEY ("category_id")
          REFERENCES "product_categories"("id")
          ON DELETE RESTRICT
      )
    `);

    // stocks
    await queryRunner.query(`
      CREATE TABLE "stocks" (
        "id"          SERIAL      NOT NULL,
        "created_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ NOT NULL DEFAULT now(),
        "product_id"  INTEGER     NOT NULL,
        "description" TEXT,
        "quantity"    INTEGER     NOT NULL DEFAULT 0,
        CONSTRAINT "UQ_stocks_product_id" UNIQUE ("product_id"),
        CONSTRAINT "PK_stocks"            PRIMARY KEY ("id"),
        CONSTRAINT "FK_stocks_product"
          FOREIGN KEY ("product_id")
          REFERENCES "products"("id")
          ON DELETE CASCADE
      )
    `);

    // customer_document_types
    await queryRunner.query(`
      CREATE TABLE "customer_document_types" (
        "id"          SERIAL                  NOT NULL,
        "created_at"  TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "name"        CHARACTER VARYING(100)  NOT NULL,
        "description" TEXT,
        CONSTRAINT "PK_customer_document_types" PRIMARY KEY ("id")
      )
    `);

    // customers
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id"                         SERIAL                  NOT NULL,
        "created_at"                 TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "updated_at"                 TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "customer_document_type_id"  INTEGER                 NOT NULL,
        "document_number"            CHARACTER VARYING(50)   NOT NULL,
        "email"                      CHARACTER VARYING(255)  NOT NULL,
        "contact_phone"              CHARACTER VARYING(30),
        "address"                    TEXT,
        CONSTRAINT "UQ_customers_document_number" UNIQUE ("document_number"),
        CONSTRAINT "UQ_customers_email"            UNIQUE ("email"),
        CONSTRAINT "PK_customers"                  PRIMARY KEY ("id"),
        CONSTRAINT "FK_customers_document_type"
          FOREIGN KEY ("customer_document_type_id")
          REFERENCES "customer_document_types"("id")
          ON DELETE RESTRICT
      )
    `);

    // transaction_statuses
    await queryRunner.query(`
      CREATE TABLE "transaction_statuses" (
        "id"          SERIAL                  NOT NULL,
        "created_at"  TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "name"        CHARACTER VARYING(100)  NOT NULL,
        "description" TEXT,
        CONSTRAINT "UQ_transaction_statuses_name" UNIQUE ("name"),
        CONSTRAINT "PK_transaction_statuses"      PRIMARY KEY ("id")
      )
    `);

    // transactions
    await queryRunner.query(`
      CREATE TABLE "transactions" (
        "id"                    SERIAL                  NOT NULL,
        "created_at"            TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "updated_at"            TIMESTAMPTZ             NOT NULL DEFAULT now(),
        "customer_id"           INTEGER                 NOT NULL,
        "cut"                   CHARACTER VARYING(255),
        "transaction_status_id" INTEGER                 NOT NULL,
        CONSTRAINT "PK_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_transactions_customer"
          FOREIGN KEY ("customer_id")
          REFERENCES "customers"("id")
          ON DELETE RESTRICT,
        CONSTRAINT "FK_transactions_status"
          FOREIGN KEY ("transaction_status_id")
          REFERENCES "transaction_statuses"("id")
          ON DELETE RESTRICT
      )
    `);

    // deliveries
    await queryRunner.query(`
      CREATE TABLE "deliveries" (
        "id"                  SERIAL      NOT NULL,
        "created_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"          TIMESTAMPTZ NOT NULL DEFAULT now(),
        "uuid"                UUID        NOT NULL DEFAULT uuid_generate_v4(),
        "customer_id"         INTEGER     NOT NULL,
        "customer_address_id" INTEGER,
        "transaction_id"      INTEGER     NOT NULL,
        CONSTRAINT "UQ_deliveries_uuid"  UNIQUE ("uuid"),
        CONSTRAINT "PK_deliveries"       PRIMARY KEY ("id"),
        CONSTRAINT "FK_deliveries_customer"
          FOREIGN KEY ("customer_id")
          REFERENCES "customers"("id")
          ON DELETE RESTRICT,
        CONSTRAINT "FK_deliveries_transaction"
          FOREIGN KEY ("transaction_id")
          REFERENCES "transactions"("id")
          ON DELETE RESTRICT
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "deliveries"`);
    await queryRunner.query(`DROP TABLE "transactions"`);
    await queryRunner.query(`DROP TABLE "transaction_statuses"`);
    await queryRunner.query(`DROP TABLE "customers"`);
    await queryRunner.query(`DROP TABLE "customer_document_types"`);
    await queryRunner.query(`DROP TABLE "stocks"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "product_categories"`);
  }
}
