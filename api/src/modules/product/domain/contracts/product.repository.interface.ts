import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";
import { Product } from "../models/product.entity";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export interface ProductRepositoryInterface{
    list(context?: TransactionContextInterface): Promise<Product[]>;
    findById(productId: ULID, context?: TransactionContextInterface): Promise<Product | null>;
    insert(product: Product, context?: TransactionContextInterface): Promise<Product>;
    update(product: Product, context?: TransactionContextInterface): Promise<Product>;
    delete(productId: ULID, context?: TransactionContextInterface): Promise<void>;
}