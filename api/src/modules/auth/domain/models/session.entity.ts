import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Session {
    public readonly id: ULID
    public readonly userId: ULID
    public refreshTokenHash: string
    public expiresAt: Date
    public createdAt: Date
    public revokedAt: Date | null
    public updatedAt: Date

    constructor (
        userId: ULID,
        refreshTokenHash: string,
        expiresAt: Date,
        id?: ULID,
        revokedAt?: Date,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.userId = userId
        this.refreshTokenHash = refreshTokenHash
        this.expiresAt = expiresAt
        this.revokedAt = revokedAt ?? null
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}