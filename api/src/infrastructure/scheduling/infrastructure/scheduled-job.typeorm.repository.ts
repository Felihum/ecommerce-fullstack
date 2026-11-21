
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    Repository,
    UpdateDateColumn,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ScheduledJob } from '../domain/models/scheduled-job.entity';
import { ScheduledJobRepositoryInterface } from '../domain/contracts/scheduled-job.repository';
import { ULID } from '@shared/domain/value-objects/ulid.vo';
import { TransactionContextInterface } from '@infrastructure/database/contracts/transaction-context.interface';
import { TypeOrmTransactionContext } from '@infrastructure/database/typeorm/typeorm-transaction-context';


@Entity('scheduled_jobs')
export class ScheduledJobEntity {

    @PrimaryColumn('varchar', { length: 26 })
    id: string;

    @Column({ unique: true, length: 150 })
    slug: string;

    @Column({ name: 'cron_expression', length: 100 })
    cronExpression: string;

    @Column({ length: 100, default: 'UTC' })
    timezone: string;

    @Column({
        name: 'next_execution_at',
        type: 'timestamptz',
        nullable: false,
    })
    nextExecutionAt: Date;

    @Column({
        name: 'last_execution_at',
        type: 'timestamptz',
        nullable: true,
    })
    lastExecutionAt: Date | null;

    @Column({
        name: 'locked_until',
        type: 'timestamptz',
        nullable: true,
    })
    lockedUntil: Date | null;

    @Column({
        name: 'locked_by',
        type: 'varchar',
        length: 100,
        nullable: true,
    })
    lockedBy: string | null;

    @Column({ default: 0 })
    attempts: number;

    @Column({ default: true })
    enabled: boolean;

    @Column({
        name: 'last_error',
        type: 'text',
        nullable: true,
    })
    lastError: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}

@Injectable()
export class ScheduledJobTypeormRepository implements ScheduledJobRepositoryInterface {

    constructor(
        @InjectRepository(ScheduledJobEntity)
        private readonly repository: Repository<ScheduledJobEntity>,
        
        @InjectDataSource()
        private readonly datasource: DataSource
    ) {}

    private getRepository(
            context?: TransactionContextInterface,
        ): Repository<ScheduledJobEntity> {
            if (!context) {
                return this.repository;
            }
    
            if (!(context instanceof TypeOrmTransactionContext)) {
                throw new Error(
                    'Invalid transaction context for TypeORM repository.',
                );
            }
    
            return context.manager.getRepository(ScheduledJobEntity);
        }

    async findById(id: string, context?: TransactionContextInterface): Promise<ScheduledJob | null> {
        const repository = this.getRepository(context)

        const entity = await repository.findOneBy({ id });

        return entity ? this.toDomain(entity) : null;
    }

    async findBySlug(slug: string, context?: TransactionContextInterface): Promise<ScheduledJob | null> {
        const repository = this.getRepository(context)

        const entity = await repository.findOneBy({ slug });

        return entity ? this.toDomain(entity) : null;
    }

    async claimDueJobs(
        workerId: string,
        limit: number,
        lockDurationSeconds: number,
        context?: TransactionContextInterface
    ): Promise<ScheduledJob[]> {

        return this.datasource.transaction(async (manager) => {

            const rows = await manager.query(
                `
                WITH due_jobs AS (
                    SELECT id
                    FROM scheduled_jobs
                    WHERE
                        enabled = TRUE
                        AND next_execution_at <= NOW()
                        AND (
                            locked_until IS NULL
                            OR locked_until < NOW()
                        )
                    ORDER BY next_execution_at ASC
                    LIMIT $1
                    FOR UPDATE SKIP LOCKED
                )
                UPDATE scheduled_jobs AS job
                SET
                    locked_until = NOW() + (
                        $3 * INTERVAL '1 second'
                    ),
                    locked_by = $2,
                    attempts = job.attempts + 1,
                    updated_at = NOW()
                FROM due_jobs
                WHERE job.id = due_jobs.id
                RETURNING job.*;
                `,
                [
                    limit,
                    workerId,
                    lockDurationSeconds,
                ],
            );

            return rows.map((row: any) => this.toDomain(
                this.mapRowToEntity(row),
            ));
        });
    }

    async markAsExecuted(
        id: string,
        workerId: string,
        nextExecutionAt: Date,
        context?: TransactionContextInterface
    ): Promise<void> {

        const repository = this.getRepository(context)

        repository
            .createQueryBuilder()
            .update(ScheduledJobEntity)
            .set({
                lastExecutionAt: () => 'NOW()',
                nextExecutionAt,
                lockedUntil: null,
                lockedBy: null,
                attempts: 0,
                lastError: null,
                enabled: nextExecutionAt !== null,
            })
            .where('id = :id', { id })
            .andWhere('locked_by = :workerId', { workerId })
            .execute();
    }

    async markAsFailed(
        id: string,
        workerId: string,
        error: string,
        retryAt: Date,
        context?: TransactionContextInterface
    ): Promise<void> {

        const repository = this.getRepository(context)

        repository
            .createQueryBuilder()
            .update(ScheduledJobEntity)
            .set({
                nextExecutionAt: retryAt,
                lockedUntil: null,
                lockedBy: null,
                lastError: error,
            })
            .where('id = :id', { id })
            .andWhere('locked_by = :workerId', { workerId })
            .execute();
    }

    async releaseLock(
        id: string,
        workerId: string,
        context?: TransactionContextInterface
    ): Promise<void> {

        const repository = this.getRepository(context)

        repository
            .createQueryBuilder()
            .update(ScheduledJobEntity)
            .set({
                lockedUntil: null,
                lockedBy: null,
            })
            .where('id = :id', { id })
            .andWhere('locked_by = :workerId', { workerId })
            .execute();
    }

    private toDomain(
        entity: ScheduledJobEntity,
    ): ScheduledJob {
        return new ScheduledJob(
            entity.slug,
            entity.cronExpression,
            entity.timezone,
            entity.nextExecutionAt,
            entity.attempts,
            entity.enabled,
            ULID.from(entity.id),
            entity.lastExecutionAt ?? undefined,
            entity.lockedUntil ?? undefined,
            entity.lockedBy ?? undefined,
            entity.lastError ?? undefined,
            entity.createdAt,
            entity.updatedAt,
        )
    }

    private mapRowToEntity(row: any): ScheduledJobEntity {
        return {
            id: row.id,
            slug: row.slug,
            cronExpression: row.cron_expression,
            timezone: row.timezone,
            nextExecutionAt: row.next_execution_at,
            lastExecutionAt: row.last_execution_at,
            lockedUntil: row.locked_until,
            lockedBy: row.locked_by,
            attempts: row.attempts,
            enabled: row.enabled,
            lastError: row.last_error,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
        };
    }
}
