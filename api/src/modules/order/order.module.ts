import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OrderEntity, OrderTypeOrmRepository } from "./infrastructure/order.typeorm.repository";
import { CreateOrderUseCase } from "./domain/use-cases/create-order.use-case";
import { AuthModule } from "@modules/auth/auth.module";
import { OrderRepositoryInterface } from "./domain/contracts/order.repository";
import { UserRepositoryInterface } from "@modules/auth/domain/contracts/user.repository.interface";
import { ProductModule } from "@modules/product/product.module";
import { ProductRepositoryInterface } from "@modules/product/domain/contracts/product.repository.interface";
import { PaymentRepositoryInterface } from "@modules/payment/domain/contracts/payment.repository";
import { PaymentGatewayInterface } from "@modules/payment/domain/contracts/payment.gateway";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";
import { UserTypeormRepository } from "@modules/auth/infrastructure/repositories/user.typeorm.repository";
import { ProductTypeOrmRepository } from "@modules/product/infrastructure/product.typeorm.repository";
import { PaymentTypeOrmRepository } from "@modules/payment/infrastructure/payment.typeorm.repository";
import { FakePaymentGateway } from "@modules/payment/infrastructure/gateway/fake-payment.gateway";
import { DatabaseModule } from "@infrastructure/database/typeorm/typeorm.module";
import { TypeOrmUnitOfWork } from "@infrastructure/database/typeorm/typeorm-unit-of-work";
import { OrderController } from "./presentation/order.controller";
import { OrderPersistenceModule } from "./infrastructure/order.persistence.module";
import { PaymentInfrastructureModule } from "@modules/payment/infrastructure/payment.persistence.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            OrderEntity,
        ]),
        DatabaseModule,
        AuthModule,
        OrderPersistenceModule,
        ProductModule,
        PaymentInfrastructureModule,
    ],
    controllers: [
        OrderController
    ],
    providers: [
        {
            provide: CreateOrderUseCase,
            useFactory: (
                orderRepository: OrderRepositoryInterface,
                userRepository: UserRepositoryInterface,
                productRepository: ProductRepositoryInterface,
                paymentRepository: PaymentRepositoryInterface,
                paymentGateway: PaymentGatewayInterface,
                unitOfWork: UnitOfWorkInterface
            ) => new CreateOrderUseCase(
                orderRepository,
                userRepository,
                productRepository,
                paymentRepository,
                paymentGateway,
                unitOfWork
            ),
            inject: [
                OrderTypeOrmRepository,
                UserTypeormRepository,
                ProductTypeOrmRepository,
                PaymentTypeOrmRepository,
                FakePaymentGateway,
                TypeOrmUnitOfWork,
            ],
        },
    ],
    exports: [
        CreateOrderUseCase,
        OrderPersistenceModule
    ],
})
export class OrderModule {}