import { DatabaseModule } from "@infrastructure/database/typeorm/typeorm.module";
import { Module } from "@nestjs/common";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { ProcessedEventEntity, ProcessedEventTypeOrmRepository } from "./infrastructure/processed-event.typeorm.repository";
import { Repository } from "typeorm";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ProcessedEventEntity
        ]),
        DatabaseModule
    ],
    providers: [
        {
            provide: ProcessedEventTypeOrmRepository,
            useFactory: (
                repository: Repository<ProcessedEventEntity>,
            ) => new ProcessedEventTypeOrmRepository(
                repository,
            ),
            inject: [
                getRepositoryToken(ProcessedEventEntity),
            ],
        }
    ],
    exports: [
        ProcessedEventTypeOrmRepository
    ]
})
export class IdempotencyModule {}