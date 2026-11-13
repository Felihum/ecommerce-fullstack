import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1794534594009 implements MigrationInterface {
    name = 'InitialMigration1794534594009'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "refreshTokenHash" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "expiresAt" SET NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "expiresAt" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "sessions" ALTER COLUMN "refreshTokenHash" DROP NOT NULL`);
    }

}
