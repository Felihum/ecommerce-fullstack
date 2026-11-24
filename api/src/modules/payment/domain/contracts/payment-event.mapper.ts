import { PaymentEvent } from "../models/payment-event.model";

export interface PaymentEventMapperInterface {
    toDomain(providerEvent: unknown): PaymentEvent;
}