import { Discount } from "@shared/domain/value-objects/discount.vo";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export enum OrderStatus {
    PENDING_PAYMENT = 'pending_payment',
    PAID = 'paid',
    CANCELED = 'canceled',
    EXPIRED = 'expired',
    REFUNDED = 'refunded'
}

export class Order {
    public readonly id: ULID
    public readonly userId: ULID
    public readonly bookId: ULID
    public subTotal: number
    public discount: Discount
    public total: number
    public status: OrderStatus
    public createdAt: Date
    public updatedAt: Date

    constructor(
        userId: ULID,
        bookId: ULID,
        subTotal: number,
        discount: Discount,
        status: OrderStatus,
        id?: ULID,
        total?: number,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.userId = userId
        this.bookId = bookId
        this.subTotal = subTotal
        this.discount = discount
        this.total = total ?? discount.apply(subTotal)
        this.status = status
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}