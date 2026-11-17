import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1794921127578 implements MigrationInterface {
    name = 'InitialMigration1794921127578'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "products" ("id" character varying(26) NOT NULL, "title" character varying(150) NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "quantity" integer NOT NULL DEFAULT '0', "discount" numeric(5,2) NOT NULL DEFAULT '0', "imageUrl" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "products"`);
    }

}
