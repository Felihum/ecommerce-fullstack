import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { PaymentTransaction } from "../models/payment-transaction.entity";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";

export interface PaymentRepositoryInterface {
    findById(id: ULID, context?: TransactionContextInterface): Promise<PaymentTransaction | null>;
    insert(payment: PaymentTransaction, context?: TransactionContextInterface): Promise<PaymentTransaction>;
    patch(payment: PaymentTransaction, context?: TransactionContextInterface): Promise<PaymentTransaction>;
}