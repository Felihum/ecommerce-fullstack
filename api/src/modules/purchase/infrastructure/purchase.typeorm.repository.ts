import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
} from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Purchase } from "@modules/purchase/domain/models/purchase.entity";
import { PurchaseRepositoryInterface } from "@modules/purchase/domain/contracts/purchase.repository";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";

@Entity("purchases")
export class PurchaseEntity {
    @PrimaryColumn({ type: "char", length: 26 })
    id: string;

    @Column({ name: "user_id", type: "char", length: 26 })
    userId: string;

    @Column({ name: "product_id", type: "char", length: 26 })
    productId: string;

    @Column({ name: "order_id", type: "char", length: 26 })
    orderId: string;

    @Column({ name: "purchased_at", type: "timestamp" })
    purchasedAt: Date;

    @CreateDateColumn({ name: "created_at", type: "timestamp" })
    createdAt: Date;
}

@Injectable()
export class PurchaseTypeOrmRepository
    implements PurchaseRepositoryInterface
{
    constructor(
        @InjectRepository(PurchaseEntity)
        private readonly repository: Repository<PurchaseEntity>,
    ) {}

    private getRepository(
        context?: TransactionContextInterface,
    ): Repository<PurchaseEntity> {
        if (!context) {
            return this.repository;
        }

        if (!(context instanceof TypeOrmTransactionContext)) {
            throw new Error(
                'Invalid transaction context for TypeORM repository.',
            );
        }

        return context.manager.getRepository(PurchaseEntity);
    }

    async listByUserId(
        userId: ULID,
        context?: TransactionContextInterface,
    ): Promise<Purchase[]> {
        const repository = this.getRepository(context);

        const purchases = await repository.find({
            where: {
                userId: userId.toString(),
            },
            order: {
                purchasedAt: "DESC",
            },
        });

        return purchases.map(this.toDomain);
    }

    async findById(
        id: ULID,
        context?: TransactionContextInterface,
    ): Promise<Purchase | null> {
        const repository = this.getRepository(context);

        const purchase = await repository.findOne({
            where: {
                id: id.toString(),
            },
        });

        return purchase ? this.toDomain(purchase) : null;
    }

    async insert(
        purchase: Purchase,
        context?: TransactionContextInterface,
    ): Promise<Purchase> {
        const repository = this.getRepository(context);

        const schema = this.toSchema(purchase);

        const saved = await repository.save(schema);

        return this.toDomain(saved);
    }

    private toDomain(schema: PurchaseEntity): Purchase {
        return new Purchase(
            ULID.from(schema.userId),
            ULID.from(schema.productId),
            ULID.from(schema.orderId),
            schema.purchasedAt,
            ULID.from(schema.id),
            schema.createdAt,
        );
    }

    private toSchema(purchase: Purchase): PurchaseEntity {
        const schema = new PurchaseEntity();

        schema.id = purchase.id.toString();
        schema.userId = purchase.userId.toString();
        schema.productId = purchase.productId.toString();
        schema.orderId = purchase.orderId.toString();
        schema.purchasedAt = purchase.purchasedAt;
        schema.createdAt = purchase.createdAt;

        return schema;
    }
}