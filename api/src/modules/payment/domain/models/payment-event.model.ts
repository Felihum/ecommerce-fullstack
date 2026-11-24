import { DomainEvent } from "@infrastructure/idempotency/domain/contracts/domain-event.entity";
import { ProcessedEvent } from "@infrastructure/idempotency/domain/models/processed-event.entity";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export enum PaymentEventType {
    CONFIRMED = 'CONFIRMED',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED',
    REFUNDED = 'REFUNDED',
}

export class PaymentEvent extends DomainEvent{
    public provider: string;
    public paymentId: ULID;
    public amount: number;
    public transactionId: string;

    constructor(
        id: string,
        provider: string,
        type: PaymentEventType,
        paymentId: ULID,
        amount: number,
        occurredAt: Date,
        transactionId: string
    ){
        super(id, type.toString(), occurredAt)
        this.provider = provider
        this.paymentId = paymentId
        this.amount = amount
        this.transactionId = transactionId
    }

    toProcessed(): ProcessedEvent {
        return new ProcessedEvent(
            this.id,
            this.type
        )
    }
}