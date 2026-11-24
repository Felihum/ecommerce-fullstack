import { PaymentEventMapperInterface } from "@modules/payment/domain/contracts/payment-event.mapper";
import { PaymentEvent } from "@modules/payment/domain/models/payment-event.model";

export class FakePaymentEventMapper implements PaymentEventMapperInterface{
    toDomain(providerEvent: unknown): PaymentEvent {
        
    }
}