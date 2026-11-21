import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1795267930831 implements MigrationInterface {
    name = 'InitialMigration1795267930831'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "scheduled_jobs" ("id" character varying(26) NOT NULL, "slug" character varying(150) NOT NULL, "cron_expression" character varying(100) NOT NULL, "timezone" character varying(100) NOT NULL DEFAULT 'UTC', "next_execution_at" TIMESTAMP WITH TIME ZONE NOT NULL, "last_execution_at" TIMESTAMP WITH TIME ZONE, "locked_until" TIMESTAMP WITH TIME ZONE, "locked_by" character varying(100), "attempts" integer NOT NULL DEFAULT '0', "enabled" boolean NOT NULL DEFAULT true, "last_error" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6b1952fb68ddf6549d0e023265" UNIQUE ("slug"), CONSTRAINT "PK_119312a5470a95ee9c733a5246d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "scheduled_jobs"`);
    }

}
