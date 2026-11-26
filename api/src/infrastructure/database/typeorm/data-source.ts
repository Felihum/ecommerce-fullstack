import { AddressEntity } from "@modules/auth/infrastructure/repositories/address.typeorm.repository";
import { SessionEntity } from "@modules/auth/infrastructure/repositories/session.typeorm.repository";
import { UserEntity } from "@modules/auth/infrastructure/repositories/user.typeorm.repository";
import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";
import { EnvSchema } from "@config/env.schema";
import { ProductEntity } from "@modules/product/infrastructure/product.typeorm.repository";
import { ScheduledJobEntity } from "@infrastructure/scheduling/infrastructure/scheduled-job.typeorm.repository";
import { PaymentTransactionEntity } from "@modules/payment/infrastructure/payment.typeorm.repository";
import { OrderEntity } from "@modules/order/infrastructure/order.typeorm.repository";
import { PurchaseEntity } from "@modules/purchase/infrastructure/purchase.typeorm.repository";
import { ProcessedEventEntity } from "@infrastructure/idempotency/infrastructure/processed-event.typeorm.repository";

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
        PaymentTransactionEntity,
        OrderEntity,
        ScheduledJobEntity,
        PurchaseEntity,
        PaymentTransactionEntity,
        ProcessedEventEntity
    ],
    migrations: [
        path.join(__dirname, '../migrations/*.ts'),
    ],
    synchronize: false,
});