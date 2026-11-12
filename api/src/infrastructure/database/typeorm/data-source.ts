import { AddressEntity } from "@modules/auth/infrastructure/repositories/address.typeorm.repository";
import { SessionEntity } from "@modules/auth/infrastructure/repositories/session.typeorm.repository";
import { UserEntity } from "@modules/auth/infrastructure/repositories/user.typeorm.repository";
import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { EnvSchema } from "@config/env.schema";

console.log({
    host: EnvSchema.DATABASE_HOST,
    port: EnvSchema.POSTGRES_PORT,
    username: EnvSchema.POSTGRES_USER,
    password: EnvSchema.POSTGRES_PASSWORD,
    database: EnvSchema.POSTGRES_DB,
    passwordLength: EnvSchema.POSTGRES_PASSWORD?.length,
});

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
    ],
    migrations: [
        path.join(__dirname, '../migrations/*.ts'),
    ],
    synchronize: false,
});