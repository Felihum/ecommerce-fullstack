import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class PaymentNotFoundException extends DomainException{
    constructor() {
        super(
            `This payment does not exist.`,
            'PAYMENT_NOT_FOUND',
        );
    }
}