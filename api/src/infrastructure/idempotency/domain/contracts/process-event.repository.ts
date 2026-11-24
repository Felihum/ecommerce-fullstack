import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { ProcessedEvent } from "../models/processed-event.entity";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";

export interface ProcessedEventRepositoryInterface {
    findById(id: ULID, context?: TransactionContextInterface): Promise<ProcessedEvent | null>;
    insert(event: ProcessedEvent, context?: TransactionContextInterface): Promise<ProcessedEvent>;
}