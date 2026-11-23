import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1795388655955 implements MigrationInterface {
    name = 'InitialMigration1795388655955'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "quantity" TO "contentUrl"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "contentUrl"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "contentUrl" text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "contentUrl"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "contentUrl" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "contentUrl" TO "quantity"`);
    }

}
