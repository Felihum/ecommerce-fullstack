import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class UserNotFoundException extends DomainException{
    constructor() {
        super(
            `This user was not found.`,
            'USER_NOT_FOUND',
        );
    }
}