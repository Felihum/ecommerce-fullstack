import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class EventAlreadyProcessedException extends DomainException{
    constructor() {
        super(
            `This event have already been processed.`,
            'EVENT_ALREADY_PROCESSED',
        );
    }
}