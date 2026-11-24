import { ProcessedEvent } from "../models/processed-event.entity";

export abstract class DomainEvent {
    public readonly id: string;
    public type: string;
    public occurredAt: Date;

    constructor(
        id: string,
        type: string,
        occurredAt: Date
    ){
        this.id = id,
        this.type = type,
        this.occurredAt = occurredAt
    }
    
    abstract toProcessed(): ProcessedEvent
}