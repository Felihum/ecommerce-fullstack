import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Session {
    private constructor (
        public readonly id: ULID,
        public readonly userId: ULID,
        public refreshTokenHash: string | null,
        public expiresAt: Date | null,
        public readonly createdAt: Date = new Date(),
        public revokedAt: Date | null,
        public updatedAt: Date
    ){}

    static create(userId: string){
        return new Session(
            ULID.create(),
            ULID.from(userId),
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
        this.updatedAt = new Date();
    }
}