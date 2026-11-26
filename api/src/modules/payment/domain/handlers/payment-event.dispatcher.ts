import { ProcessedEventRepositoryInterface } from "@infrastructure/idempotency/domain/contracts/processed-event.repository";
import { PaymentEventHandler } from "../contracts/payment-event.handler";
import { PaymentEventMapperInterface } from "../contracts/payment-event.mapper";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";

export class PaymentEventDispatcher {
    constructor(
        private readonly paymentEventHandlers: Map<string, PaymentEventHandler>,
        private readonly paymentEventMapper: PaymentEventMapperInterface,
        private readonly processedEventsRepository: ProcessedEventRepositoryInterface,
        private readonly unitOfWork: UnitOfWorkInterface
    ){}

    async execute(providerEvent: unknown){
        const domainEvent = this.paymentEventMapper.toDomain(providerEvent)

        const handler = this.paymentEventHandlers.get(domainEvent.type) as PaymentEventHandler
        
        this.unitOfWork.execute(async (context) => {
            await this.processedEventsRepository.insertIfNotExists(domainEvent.toProcessed(), context)
            await handler.execute(domainEvent, context)
        })
    }
}