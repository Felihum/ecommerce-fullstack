import { PaymentRepositoryInterface } from "@modules/payment/domain/contracts/payment.repository";
import { OrderRepositoryInterface } from "../contracts/order.repository";
import { PaymentGatewayInterface } from "@modules/payment/domain/contracts/payment.gateway";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";
import { ProductRepositoryInterface } from "@modules/product/domain/contracts/product.repository.interface";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { ProductNotFoundException } from "@modules/product/domain/exception/product-not-found.exception";
import { Order, OrderStatus } from "../models/order.entity";
import { UserRepositoryInterface } from "@modules/auth/domain/contracts/user.repository.interface";
import { UserNotFoundException } from "@modules/auth/domain/exceptions/user-not-found.exception";
import { PaymentMethod, PaymentTransaction } from "@modules/payment/domain/models/payment-transaction.entity";
import { PaymentStatus } from "@modules/payment/domain/models/payment-status.state-machine";

export interface CreateOrderInput{
    bookId: string
}

const PIX_EXPIRATION_MS = 15 * 60 * 1000;

export class CreateOrderUseCase{
    constructor(
        private readonly orderRepository: OrderRepositoryInterface,
        private readonly userRepository: UserRepositoryInterface,
        private readonly productRepository: ProductRepositoryInterface,
        private readonly paymentRepository: PaymentRepositoryInterface,
        private readonly paymentGateway: PaymentGatewayInterface,
        private readonly unitOfWork: UnitOfWorkInterface
    ){}

    async execute(userId: string, input: CreateOrderInput){
        const user = await this.userRepository.findById(ULID.from(userId))
    
        if (!user){
            throw new UserNotFoundException()
        }

        const book = await this.productRepository.findById(ULID.from(input.bookId))

        if(!book){
            throw new ProductNotFoundException()
        }

        const paymentId = ULID.create()

        const order = new Order(
            ULID.from(userId),
            ULID.from(input.bookId),
            book.price,
            book.discount,
            OrderStatus.PENDING_PAYMENT
        )

        const pixExpiration = new Date(Date.now() + PIX_EXPIRATION_MS)

        const pixResponse = await this.paymentGateway.createPixPayment({
            externalReference: paymentId.toString(),
            amount: order.total,
            description: book.description,
            expiresAt: pixExpiration,
            customer: {
                name: user.name,
                email: user.email.toString(),
                document: user.cpf.toString()
            }
        })

        const payment = new PaymentTransaction(
            order.id,
            PaymentMethod.PIX,
            order.total,
            PaymentStatus.PENDING,
            pixExpiration,
            pixResponse.providerPaymentId,
            paymentId,
            pixResponse
        )


        await this.unitOfWork.execute(async (context) => {
            await this.orderRepository.insert(order, context)
            await this.paymentRepository.insert(payment, context)
        })

        return pixResponse.pix
    }
}