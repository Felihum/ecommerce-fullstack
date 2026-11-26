
import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
    PaymentTransactionEntity,
    PaymentTypeOrmRepository
} from "./payment.typeorm.repository";

import { FakePaymentGateway } from "./gateway/fake-payment.gateway";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PaymentTransactionEntity,
        ]),
    ],
    providers: [
        {
            provide: PaymentTypeOrmRepository,
            useFactory: (
                repository: Repository<PaymentTransactionEntity>,
            ) => new PaymentTypeOrmRepository(repository),
            inject: [
                getRepositoryToken(PaymentTransactionEntity),
            ],
        },
        FakePaymentGateway,
    ],
    exports: [
        PaymentTypeOrmRepository,
        FakePaymentGateway,
    ],
})
export class PaymentInfrastructureModule {}
