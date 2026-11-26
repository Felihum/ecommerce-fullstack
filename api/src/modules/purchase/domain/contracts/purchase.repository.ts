import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Purchase } from "../models/purchase.entity";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";

export interface PurchaseRepositoryInterface {
    listByUserId(userId: ULID, context?: TransactionContextInterface): Promise<Purchase[]>;
    findById(id: ULID, context?: TransactionContextInterface): Promise<Purchase | null>;
    insert(purchase: Purchase, context?: TransactionContextInterface): Promise<Purchase>;
}