import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1795526730956 implements MigrationInterface {
    name = 'InitialMigration1795526730956'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "purchases" ("id" character(26) NOT NULL, "user_id" character(26) NOT NULL, "product_id" character(26) NOT NULL, "order_id" character(26) NOT NULL, "purchased_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1d55032f37a34c6eceacbbca6b8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "processed_events" ("id" character(26) NOT NULL, "event_id" character varying NOT NULL, "event_type" character varying NOT NULL, "processed_at" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_585a690352092645ee665d70ac2" UNIQUE ("event_id"), CONSTRAINT "PK_a08d68aa0747daea9efd2ddea53" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "processed_events"`);
        await queryRunner.query(`DROP TABLE "purchases"`);
    }

}
