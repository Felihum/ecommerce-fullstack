import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Session {
    private constructor (
        public readonly id: ULID,
        public readonly userId: ULID,
        public refreshTokenHash: string | null,
        public expiresAt: Date | null,
        public readonly createdAt: Date = new Date(),
        public revokedAt: Date | null,
        public lastActivityAt: Date
    ){}

    static create(userId: ULID){
        return new Session(
            ULID.create(),
            userId,
            null,
            null,
            new Date(),
            null,
            new Date()
        )
    }

    public update(
        refreshTokenHash: string | undefined,
        expiresAt: Date | undefined
    ){
        this.refreshTokenHash = refreshTokenHash ?? null;
        this.expiresAt = expiresAt ?? null;
        this.lastActivityAt = new Date();
    }
}