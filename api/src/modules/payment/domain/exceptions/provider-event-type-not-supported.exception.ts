import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class ProviderEventTypeNotSupportedException extends DomainException{
    constructor() {
        super(
            `This event type is not supported.`,
            'PROVIDER_EVENT_TYPE_NOT_SUPPORTED',
        );
    }
}