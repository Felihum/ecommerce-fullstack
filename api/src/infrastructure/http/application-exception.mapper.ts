import { IncorrectCredentialsException } from '@modules/auth/domain/exceptions/incorrect-credentials.exception';
import { HttpStatus } from '@nestjs/common';

export const applicationExceptionMap = new Map<Function, HttpStatus>([
    [IncorrectCredentialsException, HttpStatus.UNAUTHORIZED],
]);