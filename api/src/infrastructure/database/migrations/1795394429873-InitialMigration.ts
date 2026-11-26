import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1795394429873 implements MigrationInterface {
    name = 'InitialMigration1795394429873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payments_method_enum" AS ENUM('pix')`);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('pending', 'processing', 'paid', 'expired', 'failed', 'canceled', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" character(26) NOT NULL, "order_id" character(26) NOT NULL, "method" "public"."payments_method_enum" NOT NULL, "amount" numeric(12,2) NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'pending', "external_id" character varying, "payment_details" json, "paid_at" TIMESTAMP, "expires_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('pending_payment', 'paid', 'canceled', 'expired', 'refunded')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" character(26) NOT NULL, "user_id" character(26) NOT NULL, "book_id" character(26) NOT NULL, "sub_total" numeric(12,2) NOT NULL, "discount" numeric(5,2) NOT NULL, "total" numeric(12,2) NOT NULL, "status" "public"."orders_status_enum" NOT NULL DEFAULT 'pending_payment', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_method_enum"`);
    }

}
