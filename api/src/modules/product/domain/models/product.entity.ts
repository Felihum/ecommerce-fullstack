import { Discount } from "@shared/domain/value-objects/discount.vo";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Product{
    public readonly id: ULID
    public title: string
    public description: string
    public price: number
    public quantity: number
    public discount: Discount
    public imageUrl: string
    public createdAt: Date
    public updatedAt: Date

    constructor(
        title: string,
        description: string,
        price: number,
        quantity: number,
        imageUrl: string,
        discount?: number,
        id?: ULID,
        createdAt?: Date,
        updatedAt?: Date,
    ){
        this.id = id ?? ULID.create()
        this.title = title
        this.description = description
        this.quantity = quantity
        this.price = price
        this.imageUrl = imageUrl
        this.discount = Discount.create(discount ?? 0)
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }
}