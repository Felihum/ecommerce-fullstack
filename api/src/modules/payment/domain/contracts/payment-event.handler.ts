import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";
import { PaymentEvent, PaymentEventType } from "../models/payment-event.model";

export interface PaymentEventHandler {
    eventType: PaymentEventType
    execute(event: PaymentEvent, context: TransactionContextInterface): Promise<void> 
}