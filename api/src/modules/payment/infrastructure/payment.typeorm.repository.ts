
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { PaymentMethod, PaymentTransaction } from "../domain/models/payment-transaction.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { PaymentRepositoryInterface } from "../domain/contracts/payment.repository";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";
import { PaymentStatus } from "../domain/models/payment-status.state-machine";

@Entity("payments")
export class PaymentTransactionEntity {
    @PrimaryColumn({ type: "char", length: 26 })
    id: string;

    @Column({ name: "order_id", type: "char", length: 26 })
    orderId: string;

    @Column({
        type: "enum",
        enum: PaymentMethod,
    })
    method: PaymentMethod;

    @Column({
        type: "decimal",
        precision: 12,
        scale: 2,
    })
    amount: number;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING,
    })
    status: PaymentStatus;

    @Column({ name: "external_id", type: "varchar", nullable: true })
    externalId: string;

    @Column({
        name: "payment_details",
        type: "json",
        nullable: true,
    })
    paymentDetails: object;

    @Column({
        name: "paid_at",
        type: "timestamp",
        nullable: true,
    })
    paidAt: Date | null;

    @Column({ name: "expires_at", type: "timestamp" })
    expiresAt: Date;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}


@Injectable()
export class PaymentTypeOrmRepository implements PaymentRepositoryInterface {

    constructor(
        private readonly repository: Repository<PaymentTransactionEntity>,
    ) {}

    private getRepository(context?: TypeOrmTransactionContext): Repository<PaymentTransactionEntity> {
        if (!context) {
            return this.repository;
        }

        if (!(context instanceof TypeOrmTransactionContext)) {
            throw new Error("Invalid transaction context.");
        }

        return context.manager.getRepository(PaymentTransactionEntity);
    }

    async findById(
        id: ULID,
        context?: TypeOrmTransactionContext
    ): Promise<PaymentTransaction | null> {

        const entity = await this.getRepository(context).findOne({
            where: { id: id.toString() }
        });

        return entity ? this.toDomain(entity) : null;
    }

    async insert(
        payment: PaymentTransaction,
        context?: TypeOrmTransactionContext
    ): Promise<PaymentTransaction> {

        const entity = this.toPersistence(payment);

        const saved = await this.getRepository(context).save(entity);

        return this.toDomain(saved);
    }

    async patch(
        payment: PaymentTransaction,
        context?: TypeOrmTransactionContext
    ): Promise<PaymentTransaction> {

        const repository = this.getRepository(context);

        const entity = this.toPersistence(payment);

        await repository.update(
            { id: payment.id.toString() },
            {
                amount: entity.amount,
                status: entity.status,
                externalId: entity.externalId,
                paymentDetails: entity.paymentDetails,
                paidAt: entity.paidAt,
                updatedAt: new Date(),
            }
        );

        const updated = await repository.findOne({
            where: { id: payment.id.toString() }
        });

        if (!updated) {
            throw new Error(
                `Payment ${payment.id.toString()} not found`
            );
        }

        return this.toDomain(updated);
    }

    private toDomain(entity: PaymentTransactionEntity): PaymentTransaction {

        return new PaymentTransaction(
            ULID.from(entity.orderId),
            entity.method,
            Number(entity.amount),
            entity.status,
            entity.expiresAt,
            entity.externalId,
            ULID.from(entity.id),
            entity.paymentDetails,
            entity.paidAt ? entity.paidAt : undefined,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    private toPersistence(
        payment: PaymentTransaction
    ): PaymentTransactionEntity {

        const entity = new PaymentTransactionEntity();

        entity.id = payment.id.toString();
        entity.orderId = payment.orderId.toString();
        entity.method = payment.method;
        entity.amount = payment.amount;
        entity.status = payment.status;
        entity.externalId = payment.externalId;
        entity.paymentDetails = payment.paymentDetails;
        entity.paidAt = payment.paidAt;
        entity.expiresAt = payment.expiresAt;
        entity.createdAt = payment.createdAt;
        entity.updatedAt = payment.updatedAt;

        return entity;
    }
}
