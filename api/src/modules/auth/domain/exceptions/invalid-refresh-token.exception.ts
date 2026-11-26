import { DomainException } from "@shared/domain/exceptions/domain.exception";

export class InvalidRefreshTokenException extends DomainException{
    constructor() {
        super(
            `This refresh token is invalid`,
            'INVALID_REFRESH_TOKEN',
        );
    }
}