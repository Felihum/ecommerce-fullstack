import { Module } from "@nestjs/common";
import { ProcessPaymentsExecutor } from "./domain/executors/process-payments.executor";
import { PaymentTransactionEntity, PaymentTypeOrmRepository } from "./infrastructure/payment.typeorm.repository";
import { Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { FakePaymentGateway } from "./infrastructure/gateway/fake-payment.gateway";
import { IdempotencyModule } from "@infrastructure/idempotency/idempotency.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentTransactionEntity,
        ]),
        IdempotencyModule
    ],
    providers: [
        ProcessPaymentsExecutor,
        {
            provide: PaymentTypeOrmRepository,
            useFactory: (
                repository: Repository<PaymentTransactionEntity>,
            ) => new PaymentTypeOrmRepository(
                repository,
            ),
            inject: [
                getRepositoryToken(PaymentTransactionEntity),
            ],
        },
        FakePaymentGateway
    ],
    exports: [
        ProcessPaymentsExecutor,
        PaymentTypeOrmRepository,
        FakePaymentGateway
    ],
})
export class PaymentModule {}