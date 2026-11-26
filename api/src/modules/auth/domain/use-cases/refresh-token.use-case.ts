import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";
import { SessionRepositoryInterface } from "../contracts/session.repository.interface";
import { TokenHasherInterface } from "../contracts/token.hasher.interfacer";
import { REFRESH_TOKEN_EXPIRATION_MS, TokenPayload, TokenProviderInterface } from "../contracts/token.provider.interface";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { InvalidRefreshTokenException } from "../exceptions/invalid-refresh-token.exception";

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenOutput {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly sessionRepository: SessionRepositoryInterface,
    private readonly tokenProvider: TokenProviderInterface,
    private readonly tokenHasher: TokenHasherInterface,
    private readonly unitOfWork: UnitOfWorkInterface,
  ) {}

  async execute(
    input: RefreshTokenInput,
  ): Promise<RefreshTokenOutput> {

    let payload: TokenPayload;

    try {
      payload = await this.tokenProvider.verifyRefreshToken(input.refreshToken);
    } catch {
      throw new InvalidRefreshTokenException();
    }

    const refreshTokenHash = this.tokenHasher.encrypt(input.refreshToken);

    return this.unitOfWork.execute(async (context) => {

      const sessions = await this.sessionRepository.findByUserIdForUpdate(
        ULID.from(payload.userId),
        context,
      );

      const session = sessions[0]

      if (!session) {
        throw new InvalidRefreshTokenException();
      }

      if (session.revokedAt) {
        throw new InvalidRefreshTokenException();
      }

      if (!session.expiresAt || session.expiresAt.getTime() <= Date.now()) {
        throw new InvalidRefreshTokenException();
      }

      if (session.refreshTokenHash !== refreshTokenHash) {
        throw new InvalidRefreshTokenException();
      }

      const accessToken = await this.tokenProvider.generateAccessToken({
        userId: session.userId.toString(),
      });

      const newRefreshToken =
        await this.tokenProvider.generateRefreshToken({
          userId: session.userId.toString(),
        });

      const newRefreshTokenHash = this.tokenHasher.encrypt(newRefreshToken.value);

      const newExpiresAt = new Date(
        Date.now() + REFRESH_TOKEN_EXPIRATION_MS,
      );

      session.refreshTokenHash = newRefreshTokenHash
      session.expiresAt = newExpiresAt

      await this.sessionRepository.update(
        session,
        context,
      );

      return {
        accessToken: accessToken.value,
        refreshToken: newRefreshToken.value,
      };
    });
  }
}