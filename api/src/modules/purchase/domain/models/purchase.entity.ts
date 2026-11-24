import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Purchase {
    public readonly id: ULID
    public readonly userId: ULID
    public readonly productId: ULID
    public readonly orderId: ULID
    public purchasedAt: Date
    public createdAt: Date

    constructor(
        userId: ULID,
        productId: ULID,
        orderId: ULID,
        purchasedAt: Date,
        id?: ULID,
        createdAt?: Date
    ){
        this.id = id ?? ULID.create()
        this.userId = userId
        this.productId = productId
        this.orderId = orderId
        this.purchasedAt = purchasedAt
        this.createdAt = createdAt ?? new Date()
    }
}