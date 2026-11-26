import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class ProductNotFoundException extends DomainException{
    constructor() {
        super(
            `This product does not exist.`,
            'PRODUCT_NOT_FOUND',
        );
    }
}