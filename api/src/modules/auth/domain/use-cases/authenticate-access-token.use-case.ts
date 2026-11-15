import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { SessionRepositoryInterface } from "../contracts/session.repository.interface";
import { TokenPayload, TokenProviderInterface } from "../contracts/token.provider.interface";

export interface AuthenticateAccessTokenInput {
  accessToken: string;
}

export interface AuthenticatedUserOutput {
  userId: string;
}

export class AuthenticateAccessTokenUseCase {
  constructor(
    private readonly tokenProvider: TokenProviderInterface,
    private readonly sessionRepository: SessionRepositoryInterface,
  ) {}

  async execute(
    accessToken: string,
  ): Promise<AuthenticatedUserOutput | null> {

    let payload: TokenPayload;

    try {
      payload = await this.tokenProvider.verifyAccessToken(accessToken);
    } catch {
      return null;
    }

    const session = await this.sessionRepository.findByUserId(
      ULID.from(payload.userId),
    );

    if (!session) {
      return null;
    }

    if (session.revokedAt !== null) {
      return null;
    }

    if (session.expiresAt.getTime() <= Date.now()) {
      return null;
    }

    return {
      userId: payload.userId,
    };
  }
}