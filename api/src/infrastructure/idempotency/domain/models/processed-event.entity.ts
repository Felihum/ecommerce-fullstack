import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class ProcessedEvent{
    public readonly id: ULID
    public readonly eventId: string
    public processedAt: Date
    public eventType: string
    public createdAt: Date

    constructor(
        eventId: string,
        eventType: string,
        id?: ULID,
        processedAt?: Date,
        createdAt?: Date
    ){
        this.id = id ?? ULID.create()
        this.eventId = eventId
        this.eventType = eventType
        this.processedAt = processedAt ?? new Date()
        this.createdAt = createdAt ?? new Date()
    }
}