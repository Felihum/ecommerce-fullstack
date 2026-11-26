import { IncorrectCredentialsException } from '@modules/auth/domain/exceptions/incorrect-credentials.exception';
import { UserAlreadyExistsException } from '@modules/auth/domain/exceptions/user-already-exists.exception';
import { HttpStatus } from '@nestjs/common';

export const applicationExceptionMap = new Map<Function, HttpStatus>([
    [IncorrectCredentialsException, HttpStatus.UNAUTHORIZED],
    [UserAlreadyExistsException, HttpStatus.BAD_REQUEST]
]);