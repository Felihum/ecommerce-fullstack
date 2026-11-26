import { Module } from "@nestjs/common";
import { ProcessPaymentsExecutor } from "./domain/executors/process-payments.executor";
import { PaymentTransactionEntity, PaymentTypeOrmRepository } from "./infrastructure/payment.typeorm.repository";
import { Repository } from "typeorm";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { FakePaymentGateway } from "./infrastructure/gateway/fake-payment.gateway";
import { IdempotencyModule } from "@infrastructure/idempotency/idempotency.module";
import { ConfirmPaymentUseCase } from "./domain/use-cases/confirm-payment.use-case";
import { PaymentRepositoryInterface } from "./domain/contracts/payment.repository";
import { OrderRepositoryInterface } from "@modules/order/domain/contracts/order.repository";
import { PurchaseRepositoryInterface } from "@modules/purchase/domain/contracts/purchase.repository";
import { OrderTypeOrmRepository } from "@modules/order/infrastructure/order.typeorm.repository";
import { PurchaseTypeOrmRepository } from "@modules/purchase/infrastructure/purchase.typeorm.repository";
import { DatabaseModule } from "@infrastructure/database/typeorm/typeorm.module";
import { OrderModule } from "@modules/order/order.module";
import { PurchaseModule } from "@modules/purchase/purchase.module";
import { PaymentEventDispatcher } from "./domain/handlers/payment-event.dispatcher";
import { FakePaymentEventMapper } from "./infrastructure/gateway/fake-payment.mapper";
import { PaymentEventHandler } from "./domain/contracts/payment-event.handler";
import { PaymentEventMapperInterface } from "./domain/contracts/payment-event.mapper";
import { ProcessedEventRepositoryInterface } from "@infrastructure/idempotency/domain/contracts/processed-event.repository";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";
import { PaymentEventType } from "./domain/models/payment-event.model";
import { ProcessedEventTypeOrmRepository } from "@infrastructure/idempotency/infrastructure/processed-event.typeorm.repository";
import { TypeOrmUnitOfWork } from "@infrastructure/database/typeorm/typeorm-unit-of-work";
import { PaymentWebhookController } from "./presentation/payment.webhook.controller";
import { PaymentInfrastructureModule } from "./infrastructure/payment.persistence.module";
import { OrderPersistenceModule } from "@modules/order/infrastructure/order.persistence.module";

export const PAYMENT_EVENT_HANDLERS = Symbol(
    'PAYMENT_EVENT_HANDLERS',
);

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentTransactionEntity,
        ]),
        IdempotencyModule,
        DatabaseModule,
        OrderPersistenceModule,
        PaymentInfrastructureModule,
        PurchaseModule
    ],
    providers: [
        ProcessPaymentsExecutor,
        FakePaymentEventMapper,
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
        {
            provide: ConfirmPaymentUseCase,
            useFactory: (
                paymentRepository: PaymentRepositoryInterface,
                orderRepository: OrderRepositoryInterface,
                purchaseRepository: PurchaseRepositoryInterface
            ) => new ConfirmPaymentUseCase(
                paymentRepository,
                orderRepository,
                purchaseRepository
            ),
            inject: [
                PaymentTypeOrmRepository,
                OrderTypeOrmRepository,
                PurchaseTypeOrmRepository
            ],
        },
        {
            provide: ConfirmPaymentUseCase,
            useFactory: (
                paymentRepository: PaymentRepositoryInterface,
                orderRepository: OrderRepositoryInterface,
                purchaseRepository: PurchaseRepositoryInterface
            ) => new ConfirmPaymentUseCase(
                paymentRepository,
                orderRepository,
                purchaseRepository
            ),
            inject: [
                PaymentTypeOrmRepository,
                OrderTypeOrmRepository,
                PurchaseTypeOrmRepository
            ],
        },
        {
            provide: PAYMENT_EVENT_HANDLERS,
            useFactory: (
                confirmPaymentUseCase: ConfirmPaymentUseCase,
            ): Map<string, PaymentEventHandler> => {
                return new Map<string, PaymentEventHandler>([
                    [PaymentEventType.CONFIRMED, confirmPaymentUseCase  ],
                ]);
            },
            inject: [ConfirmPaymentUseCase],
        },
        {
            provide: PaymentEventDispatcher,
            useFactory: (
                paymentHandlers: Map<string, PaymentEventHandler>,
                paymentMapper: PaymentEventMapperInterface,
                processedEventsRepository: ProcessedEventRepositoryInterface,
                unitOfWork: UnitOfWorkInterface

            ) => new PaymentEventDispatcher(
                paymentHandlers,
                paymentMapper,
                processedEventsRepository,
                unitOfWork
            ),
            inject: [
                PAYMENT_EVENT_HANDLERS,
                FakePaymentEventMapper,
                ProcessedEventTypeOrmRepository,
                TypeOrmUnitOfWork
            ],
        },
        FakePaymentGateway
    ],
    controllers: [
        PaymentWebhookController
    ],
    exports: [
        ProcessPaymentsExecutor,
        PaymentInfrastructureModule,
        FakePaymentGateway
    ],
})
export class PaymentModule {}