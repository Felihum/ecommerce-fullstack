
import {
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from "typeorm";
import { Order, OrderStatus } from "../domain/models/order.entity";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Discount } from "@shared/domain/value-objects/discount.vo";
import { OrderRepositoryInterface } from "../domain/contracts/order.repository";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";

@Entity("orders")
export class OrderEntity {
    @PrimaryColumn({ type: "char", length: 26 })
    id: string;

    @Column({ name: "user_id", type: "char", length: 26 })
    userId: string;

    @Column({ name: "book_id", type: "char", length: 26 })
    bookId: string;

    @Column({ name: "sub_total", type: "decimal", precision: 12, scale: 2 })
    subTotal: number;

    @Column({ type: "decimal", precision: 5, scale: 2 })
    discount: number;

    @Column({ type: "decimal", precision: 12, scale: 2 })
    total: number;

    @Column({
        type: "enum",
        enum: OrderStatus,
        default: OrderStatus.PENDING_PAYMENT,
    })
    status: OrderStatus;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}

@Injectable()
export class OrderTypeOrmRepository implements OrderRepositoryInterface {

    constructor(
        private readonly repository: Repository<OrderEntity>
    ) {}

    private getRepository(context?: TypeOrmTransactionContext): Repository<OrderEntity> {
        if (!context) {
        return this.repository;
        }

        if (!(context instanceof TypeOrmTransactionContext)) {
        throw new Error("Invalid transaction context.");
        }

        return context.manager.getRepository(OrderEntity);
    }

    private toDomain(entity: OrderEntity): Order {
        return new Order(
            ULID.from(entity.userId),
            ULID.from(entity.bookId),
            Number(entity.subTotal),
            Discount.create(Number(entity.discount)),
            entity.status,
            ULID.from(entity.id),
            Number(entity.total),
            entity.createdAt,
            entity.updatedAt
        );
    }

    private toPersistence(order: Order): OrderEntity {
        const entity = new OrderEntity();

        entity.id = order.id.toString();
        entity.userId = order.userId.toString();
        entity.bookId = order.bookId.toString();
        entity.subTotal = order.subTotal;
        entity.discount = order.discount.getValue();
        entity.total = order.total;
        entity.status = order.status;
        entity.createdAt = order.createdAt;
        entity.updatedAt = order.updatedAt;

        return entity;
    }

    async list(
        context?: TypeOrmTransactionContext
    ): Promise<Order[]> {

        const entities = await this.getRepository(context).find();

        return entities.map(this.toDomain);
    }

    async findById(
        id: ULID,
        context?: TypeOrmTransactionContext
    ): Promise<Order | null> {

        const entity = await this.getRepository(context).findOne({
            where: { id: id.toString() }
        });

        return entity ? this.toDomain(entity) : null;
    }

    async insert(
        order: Order,
        context?: TypeOrmTransactionContext
    ): Promise<Order> {

        const entity = this.toPersistence(order);

        const saved = await this.getRepository(context).save(entity);

        return this.toDomain(saved);
    }

    async update(
        order: Order,
        context?: TypeOrmTransactionContext
    ): Promise<Order> {

        const entity = this.toPersistence(order);

        const saved = await this.getRepository(context).save(entity);

        return this.toDomain(saved);
    }

    async delete(
        id: ULID,
        context?: TypeOrmTransactionContext
    ): Promise<void> {

        await this.getRepository(context).delete({
            id: id.toString()
        });
    }
}
