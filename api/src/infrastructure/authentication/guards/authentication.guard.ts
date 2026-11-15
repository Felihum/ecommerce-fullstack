import { AuthenticateAccessTokenUseCase } from "@modules/auth/domain/use-cases/authenticate-access-token.use-case";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly authenticateAccessToken: AuthenticateAccessTokenUseCase,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing access token');
    }

    const accessToken = authorization.substring(7);

    const authenticatedUser =
      await this.authenticateAccessToken.execute(accessToken);

    if (!authenticatedUser) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    request.user = authenticatedUser;

    return true;
  }
}