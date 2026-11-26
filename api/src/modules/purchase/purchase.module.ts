import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { PurchaseEntity, PurchaseTypeOrmRepository } from "./infrastructure/purchase.typeorm.repository";
import { DatabaseModule } from "@infrastructure/database/typeorm/typeorm.module";
import { Repository } from "typeorm";
import { ListPurchaseByUserUseCase } from "./domain/use-cases/list-purchase-by-user.use-case";
import { PurchaseRepositoryInterface } from "./domain/contracts/purchase.repository";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            PurchaseEntity
        ]),
        DatabaseModule
    ],
    providers: [
        {
            provide: PurchaseTypeOrmRepository,
            useFactory: (
                repository: Repository<PurchaseEntity>
            ) => new PurchaseTypeOrmRepository(
                repository
            ),
            inject: [
                getRepositoryToken(PurchaseEntity)
            ]
        },
        {
            provide: ListPurchaseByUserUseCase,
            useFactory: (
                purchaseRepository: PurchaseRepositoryInterface
            ) => new ListPurchaseByUserUseCase(
                purchaseRepository
            ),
            inject: [
                PurchaseTypeOrmRepository
            ]
        }
    ],
    // controllers: [

    // ],
    exports: [
        ListPurchaseByUserUseCase,
        PurchaseTypeOrmRepository
    ]
})
export class PurchaseModule {}