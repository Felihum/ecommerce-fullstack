import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Order } from "../models/order.entity";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";

export interface OrderRepositoryInterface{
    list(context?: TransactionContextInterface): Promise<Order[]>;
    findById(id: ULID, context?: TransactionContextInterface): Promise<Order | null>;
    insert(order: Order, context?: TransactionContextInterface): Promise<Order>;
    update(order: Order, context?: TransactionContextInterface): Promise<Order>;
    delete(id: ULID, context?: TransactionContextInterface): Promise<void>;
}