import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { PaymentStateMachine, PaymentStatus } from "./payment-status.state-machine";

export enum PaymentMethod{
    PIX = 'pix'
}

export class PaymentTransaction{
    public readonly id: ULID
    public readonly orderId: ULID
    public readonly method: PaymentMethod
    public amount: number
    private _status: PaymentStatus
    public externalId: string
    public paymentDetails: object
    public paidAt: Date | null
    public readonly expiresAt: Date
    public readonly createdAt: Date
    public updatedAt: Date

    constructor(
        orderId: ULID,
        method: PaymentMethod,
        amount: number,
        status: PaymentStatus,
        expiresAt: Date,
        externalId: string,
        id?: ULID,
        paymentDetails?: object,
        paidAt?: Date,
        createdAt?: Date,
        updatedAt?: Date
    ){
        this.id = id ?? ULID.create()
        this.orderId = orderId
        this.method = method
        this.amount = amount
        this.paymentDetails = paymentDetails ?? {}
        this._status = status
        this.externalId = externalId
        this.expiresAt = expiresAt
        this.paidAt = paidAt ?? null
        this.createdAt = createdAt ?? new Date()
        this.updatedAt = updatedAt ?? new Date()
    }

    get status(): PaymentStatus {
        return this._status;
    }

    private changeStatus(target: PaymentStatus): void {
        this._status = PaymentStateMachine.transition(
            this._status,
            target,
        );

        if (target === PaymentStatus.PAID) {
            this.paidAt = new Date();
        }
    }

    markAsProcessing(): void {
        this.changeStatus(PaymentStatus.PROCESSING);
    }

    markAsPaid(): void {
        this.changeStatus(PaymentStatus.PAID);
    }

    markAsExpired(): void {
        this.changeStatus(PaymentStatus.EXPIRED);
    }

    markAsFailed(): void {
        this.changeStatus(PaymentStatus.FAILED);
    }

    cancel(): void {
        this.changeStatus(PaymentStatus.CANCELED);
    }

    refund(): void {
        this.changeStatus(PaymentStatus.REFUNDED);
    }
}