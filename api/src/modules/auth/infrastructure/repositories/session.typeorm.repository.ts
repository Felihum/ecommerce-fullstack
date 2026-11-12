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
        nullable: true,
    })
    refreshTokenHash: string | null;

    @Column({
        type: "timestamp",
        nullable: true,
    })
    expiresAt: Date | null;

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
        return Session.create(entity.user.id);
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