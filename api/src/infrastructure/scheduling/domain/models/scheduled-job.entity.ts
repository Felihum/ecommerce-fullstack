import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class ScheduledJob{
    public readonly id: ULID;
    public slug: string;
    public cronExpression: string;
    public timezone: string;
    public nextExecutionAt: Date;
    public lastExecutionAt: Date | null;
    public lockedUntil: Date | null;
    public lockedBy: string | null;
    public attempts: number;
    public enabled: boolean;
    public lastError: string | null;
    public createdAt: Date;
    public updatedAt: Date;

    constructor(
        slug: string,
        cronExpression: string,
        timezone: string,
        nextExecutionAt: Date,
        attempts: number,
        enabled: boolean,
        id?: ULID,
        lastExecutionAt?: Date,
        lockedUntil?: Date,
        lockedBy?: string,
        lastError?: string,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.slug = slug
        this.cronExpression = cronExpression
        this.timezone = timezone
        this.nextExecutionAt = nextExecutionAt
        this.attempts = attempts
        this.enabled = enabled
        this.lastExecutionAt = lastExecutionAt ?? null
        this.lockedUntil = lockedUntil ?? null
        this.lockedBy = lockedBy ?? null
        this.lastError = lastError ?? null
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}
