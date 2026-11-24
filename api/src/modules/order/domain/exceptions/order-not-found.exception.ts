import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class OrderNotFoundException extends DomainException{
    constructor() {
        super(
            `This order does not exist.`,
            'ORDER_NOT_FOUND',
        );
    }
}