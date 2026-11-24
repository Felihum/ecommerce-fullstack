import { ProcessedEvent } from "../models/processed-event.entity";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";

export interface ProcessedEventRepositoryInterface {
    insertIfNotExists(event: ProcessedEvent, context?: TransactionContextInterface): Promise<ProcessedEvent>;
}