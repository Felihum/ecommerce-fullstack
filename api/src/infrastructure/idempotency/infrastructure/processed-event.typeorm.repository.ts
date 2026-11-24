import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ULID } from '@shared/domain/value-objects/ulid.vo';
import { TypeOrmTransactionContext } from '@infrastructure/database/typeorm/typeorm-transaction-context';
import { ProcessedEvent } from '../domain/models/processed-event.entity';
import { ProcessedEventRepositoryInterface } from '../domain/contracts/process-event.repository';

@Entity('processed_events')
export class ProcessedEventEntity {
    @PrimaryColumn({ type: 'char', length: 26 })
    id: string;

    @Column({ name: 'event_id', type: 'varchar', unique: true })
    eventId: string;

    @Column({ name: 'event_type', type: 'varchar' })
    eventType: string;

    @Column({ name: 'processed_at', type: 'timestamp' })
    processedAt: Date;

    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
}

@Injectable()
export class ProcessedEventTypeOrmRepository implements ProcessedEventRepositoryInterface {
    constructor(
        private readonly repository: Repository<ProcessedEventEntity>,
    ) {}

    async insertIfNotExists(
        event: ProcessedEvent,
        context?: TypeOrmTransactionContext,
    ): Promise<ProcessedEvent> {
        const repository = this.getRepository(context);

        await repository
            .createQueryBuilder()
            .insert()
            .into(ProcessedEventEntity)
            .values({
                id: event.id.toString(),
                eventId: event.eventId,
                eventType: event.eventType,
                processedAt: event.processedAt,
                createdAt: event.createdAt,
            })
            .orIgnore()
            .execute();

        const persistedEvent = await repository.findOne({
            where: {
                eventId: event.eventId,
            },
        });

        if (!persistedEvent) {
            throw new Error(
                `Failed to retrieve processed event: ${event.eventId}`,
            );
        }

        return this.toDomain(persistedEvent);
    }

    private getRepository(context?: TypeOrmTransactionContext): Repository<ProcessedEventEntity> {
        if (!context) {
            return this.repository;
        }

        if (!(context instanceof TypeOrmTransactionContext)) {
            throw new Error("Invalid transaction context.");
        }

        return context.manager.getRepository(ProcessedEventEntity);
    }
    

    private toDomain(
        entity: ProcessedEventEntity,
    ): ProcessedEvent {
        return new ProcessedEvent(
            entity.eventId,
            entity.eventType,
            ULID.from(entity.id),
            entity.processedAt,
            entity.createdAt,
        );
    }
}