import { ULID } from "@shared/domain/value-objects/ulid.vo";

export enum CartStatus {
    ACTIVE = 'active',
    CONVERTED = 'converted',
    ABANDONED = 'abandoned'
}

export class Cart {
    public readonly id: ULID
    public readonly userId: ULID
    public status: CartStatus
    public createdAt: Date
    public updatedAt: Date

    constructor(
        status: CartStatus,
        userId: ULID,
        id?: ULID,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.userId = userId
        this.status = status
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}

export class CartItem {
    public readonly id: ULID
    public readonly cartId: ULID
    public readonly bookId: ULID
    public createdAt: Date

    constructor(
        cartId: ULID,
        bookId: ULID,
        id?: ULID,
        createdAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.cartId = cartId
        this.bookId = bookId
        this.createdAt = createdAt ?? new Date()
    }
}