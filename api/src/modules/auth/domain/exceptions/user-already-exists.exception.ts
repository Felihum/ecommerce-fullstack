import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class UserAlreadyExistsException extends DomainException{
    constructor() {
        super(
            `This user already exists.`,
            'USER_ALREADY_EXISTS',
        );
    }
}