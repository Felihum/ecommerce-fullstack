import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";
import { PaymentEventHandler } from "../contracts/payment-event.handler";
import { PaymentRepositoryInterface } from "../contracts/payment.repository";
import { PaymentEvent, PaymentEventType } from "../models/payment-event.model";
import { OrderRepositoryInterface } from "@modules/order/domain/contracts/order.repository";
import { PurchaseRepositoryInterface } from "@modules/purchase/domain/contracts/purchase.repository";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { OrderStatus } from "@modules/order/domain/models/order.entity";
import { Purchase } from "@modules/purchase/domain/models/purchase.entity";


export class ConfirmPaymentUseCase implements PaymentEventHandler {
    public readonly eventType = PaymentEventType.CONFIRMED

    constructor(
        private readonly paymentRepository: PaymentRepositoryInterface,
        private readonly orderRepository: OrderRepositoryInterface,
        private readonly purchaseRepository: PurchaseRepositoryInterface
    ){}

    async execute(event: PaymentEvent, context: TransactionContextInterface): Promise<void> {
        
        const payment = await this.paymentRepository.findById(ULID.from(event.transactionId), context)
        
        if (!payment){
            // Trocar pela exceção correta de PaymentNotFound !
            throw new Error()
        }

        if (payment.amount != event.amount){
            // Trocar pela exceção correta de AmountDoesntMatch !
            throw new Error()
        }

        const order = await this.orderRepository.findById(payment.orderId, context)

        if(!order){
            // Trocar pela exceção correta de OrderNotFound !
            throw new Error()
        }
        
        payment.markAsPaid()
        order.status = OrderStatus.PAID

        const purchase = new Purchase(
            order.userId, 
            order.bookId,
            order.id,
            payment.paidAt as Date
        )
        
        await this.paymentRepository.patch(payment, context)
        await this.orderRepository.update(order, context)
        await this.purchaseRepository.insert(purchase, context)
    }
}