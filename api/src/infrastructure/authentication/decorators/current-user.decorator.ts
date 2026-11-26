import { AuthenticatedUserOutput } from '@modules/auth/domain/use-cases/authenticate-access-token.use-case';
import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUserOutput | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    const user = request.user as AuthenticatedUserOutput;

    return data ? user?.[data] : user;
  },
);