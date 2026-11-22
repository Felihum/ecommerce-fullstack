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
    public readonly cartId: ULID
    public subTotal: number
    public discount: number
    public total: number
    public status: OrderStatus
    public createdAt: Date
    public updatedAt: Date

    constructor(
        userId: ULID,
        cartId: ULID,
        subTotal: number,
        discount: number,
        status: OrderStatus,
        id?: ULID,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.userId = userId
        this.cartId = cartId
        this.subTotal = subTotal
        this.discount = discount
        this.total = subTotal - (subTotal * (discount/100))
        this.status = status
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}

export class OrderItem {
    public readonly id: ULID
    public readonly orderId: ULID
    public readonly bookId: ULID
    public title: string
    public price: number
    public createdAt: Date
    public updatedAt: Date

    constructor(
        orderId: ULID,
        bookId: ULID,
        title: string,
        price: number,
        id?: ULID,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.orderId = orderId
        this.bookId = bookId
        this.title = title
        this.price = price
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}