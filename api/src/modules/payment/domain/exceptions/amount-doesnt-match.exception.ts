import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class AmountUnmatchException extends DomainException{
    constructor() {
        super(
            `The provided amount does not match.`,
            'AMOUNT_UNMATCH',
        );
    }
}