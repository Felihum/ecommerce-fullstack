
import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import {
    OrderEntity,
    OrderTypeOrmRepository
} from "./order.typeorm.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([OrderEntity]),
    ],
    providers: [
        {
            provide: OrderTypeOrmRepository,
            useFactory: (
                repository: Repository<OrderEntity>,
            ) => new OrderTypeOrmRepository(repository),
            inject: [
                getRepositoryToken(OrderEntity),
            ],
        },
    ],
    exports: [
        OrderTypeOrmRepository,
    ],
})
export class OrderPersistenceModule {}
