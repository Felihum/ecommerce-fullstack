import { AddressEntity } from "@modules/auth/infrastructure/repositories/address.typeorm.repository";
import { SessionEntity } from "@modules/auth/infrastructure/repositories/session.typeorm.repository";
import { UserEntity } from "@modules/auth/infrastructure/repositories/user.typeorm.repository";
import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { EnvSchema } from "@config/env.schema";
import { ProductEntity } from "@modules/product/infrastructure/product.typeorm.repository";
import { ScheduledJobEntity } from "@infrastructure/scheduling/infrastructure/scheduled-job.typeorm.repository";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: EnvSchema.DATABASE_HOST,
    port: Number(EnvSchema.POSTGRES_PORT),
    username: EnvSchema.POSTGRES_USER,
    password: EnvSchema.POSTGRES_PASSWORD,
    database: EnvSchema.POSTGRES_DB,
    entities: [
        UserEntity,
        SessionEntity,
        AddressEntity,
        ProductEntity,
        ScheduledJobEntity
    ],
    migrations: [
        path.join(__dirname, '../migrations/*.ts'),
    ],
    synchronize: false,
});