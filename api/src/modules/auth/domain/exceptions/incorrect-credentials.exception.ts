import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class IncorrectCredentialsException extends DomainException{
    constructor() {
        super(
            `Incorrect credentials provided`,
            'INCORRECT_CREDENTIALS',
        );
    }
}