import { JoinColumn, ManyToOne, Repository } from "typeorm";
import { Entity, Column, PrimaryColumn } from 'typeorm';
import { UserEntity } from "./user.typeorm.repository";
import { SessionRepositoryInterface } from "@modules/auth/domain/contracts/session.repository.interface";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Session } from "@modules/auth/domain/models/session.entity";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";
import { Injectable } from "@nestjs/common";

@Entity("sessions")
export class SessionEntity {
    @PrimaryColumn({
        type: "varchar",
        length: 26,
    })
    id: string;

    @ManyToOne(() => UserEntity, {
        nullable: false,
    })
    @JoinColumn({ name: "user_id" })
    user: UserEntity;

    @Column({
        type: "varchar",
    })
    refreshTokenHash: string;

    @Column({
        type: "timestamp",
    })
    expiresAt: Date;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    revokedAt: Date | null;

    @Column({
        type: "timestamp",
    })
    createdAt: Date;

    @Column({
        type: "timestamp",
    })
    updatedAt: Date;
}

@Injectable()
export class SessionTypeOrmRepository implements SessionRepositoryInterface{
    constructor(
        private readonly repository: Repository<SessionEntity>
    ){}

    private getRepository(context?: TypeOrmTransactionContext): Repository<SessionEntity> {
        if (!context) {
        return this.repository;
        }

        if (!(context instanceof TypeOrmTransactionContext)) {
        throw new Error("Invalid transaction context.");
        }

        return context.manager.getRepository(SessionEntity);
    }

    private toDomain(entity: SessionEntity): Session {
        return new Session(
            ULID.from(entity.user.id),
            entity.refreshTokenHash,
            entity.expiresAt,
            ULID.from(entity.id),
            entity.revokedAt ?? undefined,
            entity.createdAt,
            entity.updatedAt
        );
    }

    private toPersistence(session: Session): SessionEntity {
        return this.repository.create({
            id: session.id.toString(),
            user: {
                id: session.userId.toString(),
            } as UserEntity,
            refreshTokenHash: session.refreshTokenHash,
            expiresAt: session.expiresAt,
            revokedAt: session.revokedAt,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        });
    }

    async findById(id: ULID): Promise<Session | null> {
        const entity = await this.repository.findOne({
            where: {
                id: id.toString(),
            },
            relations: {
                user: true,
            },
        });

        return entity ? this.toDomain(entity) : null;
    }

    async findByRefreshToken(token: string): Promise<Session | null> {
        const entity = await this.repository.findOne({
            where: {
                refreshTokenHash: token,
            },
            relations: {
                user: true,
            },
        });

        return entity ? this.toDomain(entity) : null;
    }

    async insert(
        session: Session,
        context?: TypeOrmTransactionContext
    ): Promise<Session> {
        const repository = this.getRepository(context);

        const entity = repository.create({ ...this.toPersistence(session) });

        const savedEntity = await repository.save(entity);

        return this.toDomain(savedEntity);
    }
    async patch(
        session: Session,
        context?: TypeOrmTransactionContext
    ): Promise<Session> {
        const repository = this.getRepository(context);

        const existingSession = await repository.findOne({
            where: {
                user: {
                    id: session.userId.toString(),
                },
            },
        });

        const entity = this.toPersistence(session);

        if (existingSession) {
            await repository.update(
                { id: existingSession.id },
                {
                    id: entity.id,
                    refreshTokenHash: entity.refreshTokenHash,
                    expiresAt: entity.expiresAt,
                    revokedAt: entity.revokedAt,
                    createdAt: entity.createdAt,
                    updatedAt: entity.updatedAt,
                }
            );
        } else {
            await repository.insert(entity);
        }

        const savedEntity = await repository.findOne({
            where: {
                id: session.id.toString(),
            },
            relations: {
                user: true,
            },
        });

        if (!savedEntity) {
            throw new Error("Failed to persist session.");
        }

        return this.toDomain(savedEntity);
    }

    async update(
        session: Session,
        context?: TypeOrmTransactionContext
    ): Promise<Session> {
        const repository = this.getRepository(context);

        const entity = this.toPersistence(session);

        const savedEntity = await repository.save(entity);

        return this.toDomain(savedEntity);
    }

    async delete(id: ULID): Promise<void> {
        await this.repository.delete({ id: id.toString() });
    }
}