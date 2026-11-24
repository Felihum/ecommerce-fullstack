import { PaymentEventMapperInterface } from "@modules/payment/domain/contracts/payment-event.mapper";
import { ProviderEventTypeNotSupportedException } from "@modules/payment/domain/exceptions/provider-event-type-not-supported.exception";
import {
    PaymentEvent,
    PaymentEventType,
} from "@modules/payment/domain/models/payment-event.model";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

interface FakePaymentEvent {
    id: string;
    type: string;
    created_at: Date;
    data: {
        payment: {
            id: string;
            external_reference: string;
            status: string;
            amount: {
                value: number;
                currency: string;
            };
            method: string;
            paid_at: string;
            pix: {
                end_to_end_id: string;
            };
        };
    };
}

const eventsMap = new Map<string, PaymentEventType>([
    ["payment.confirmed", PaymentEventType.CONFIRMED],
    ["payment.expired", PaymentEventType.EXPIRED],
    ["payment.cancelled", PaymentEventType.CANCELLED],
    ["payment.refunded", PaymentEventType.REFUNDED],
]);

export class FakePaymentEventMapper implements PaymentEventMapperInterface {
    toDomain(providerEvent: FakePaymentEvent): PaymentEvent {
        const eventType = eventsMap.get(providerEvent.type);

        if (!eventType) {
            throw new ProviderEventTypeNotSupportedException()
        }

        return new PaymentEvent(
            providerEvent.id,
            "fake_payment",
            eventType,
            providerEvent.data.payment.id,
            providerEvent.data.payment.amount.value,
            providerEvent.created_at,
            ULID.from(providerEvent.data.payment.external_reference)
        );
    }
}
