import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";
import { PaymentEventHandler } from "../contracts/payment-event.handler";
import { PaymentRepositoryInterface } from "../contracts/payment.repository";
import { PaymentEvent, PaymentEventType } from "../models/payment-event.model";
import { OrderRepositoryInterface } from "@modules/order/domain/contracts/order.repository";
import { PurchaseRepositoryInterface } from "@modules/purchase/domain/contracts/purchase.repository";
import { OrderStatus } from "@modules/order/domain/models/order.entity";
import { Purchase } from "@modules/purchase/domain/models/purchase.entity";
import { AmountUnmatchException } from "../exceptions/amount-doesnt-match.exception";
import { PaymentNotFoundException } from "../exceptions/payment-not-found.exception";
import { OrderNotFoundException } from "@modules/order/domain/exceptions/order-not-found.exception";


export class ConfirmPaymentUseCase implements PaymentEventHandler {
    public readonly eventType = PaymentEventType.CONFIRMED

    constructor(
        private readonly paymentRepository: PaymentRepositoryInterface,
        private readonly orderRepository: OrderRepositoryInterface,
        private readonly purchaseRepository: PurchaseRepositoryInterface
    ){}

    async execute(event: PaymentEvent, context: TransactionContextInterface): Promise<void> {
        
        const payment = await this.paymentRepository.findById(event.transactionId, context)
        
        if (!payment){
            throw new PaymentNotFoundException()
        }

        if (payment.amount != event.amount){
            throw new AmountUnmatchException()
        }

        const order = await this.orderRepository.findById(payment.orderId, context)

        if(!order){
            throw new OrderNotFoundException()
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