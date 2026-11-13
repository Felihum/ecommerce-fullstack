
import { TokenPayload, TokenProviderInterface, TokenResponse } from "@modules/auth/domain/contracts/token.provider.interface";
import { SignJWT, jwtVerify } from "jose";
import { EnvSchema } from "../../../config/env.schema";

export class JwtTokenProvider implements TokenProviderInterface {
  private readonly accessSecret: Uint8Array;
  private readonly refreshSecret: Uint8Array;

  private readonly issuer = "my-application";
  private readonly audience = "my-application-users";

  private readonly accessDuration = 900;
  private readonly refreshDuration = 604800;

  constructor() {
    if (EnvSchema.JWT_ACCESS_SECRET.length < 32 || EnvSchema.JWT_REFRESH_SECRET.length < 32) {
      throw new Error("JWT secrets must contain at least 32 characters.");
    }

    this.accessSecret = new TextEncoder().encode(EnvSchema.JWT_ACCESS_SECRET);
    this.refreshSecret = new TextEncoder().encode(EnvSchema.JWT_REFRESH_SECRET);
  }

  async generateAccessToken(
    payload: TokenPayload,
  ): Promise<TokenResponse> {
    const value = await new SignJWT({
      userId: payload.userId,
      tokenType: "access",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.userId)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt()
      .setExpirationTime(`${this.accessDuration}s`)
      .sign(this.accessSecret);

    return {
      value,
      duration: this.accessDuration,
    };
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.verifyToken(
      token,
      this.accessSecret,
      "access",
    );
  }

  async generateRefreshToken(
    payload: TokenPayload,
  ): Promise<TokenResponse> {
    const value = await new SignJWT({
      userId: payload.userId,
      tokenType: "refresh",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(payload.userId)
      .setIssuer(this.issuer)
      .setAudience(this.audience)
      .setIssuedAt()
      .setExpirationTime(`${this.refreshDuration}s`)
      .sign(this.refreshSecret);

    return {
      value,
      duration: this.refreshDuration,
    };
  }

  async verifyRefreshToken(token: string): Promise<TokenPayload> {
    return this.verifyToken(
      token,
      this.refreshSecret,
      "refresh",
    );
  }

  private async verifyToken(
    token: string,
    secret: Uint8Array,
    expectedType: "access" | "refresh",
  ): Promise<TokenPayload> {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ["HS256"],
      issuer: this.issuer,
      audience: this.audience,
    });

    if (
      typeof payload.sub !== "string" ||
      payload.tokenType !== expectedType
    ) {
      throw new Error("Invalid token payload.");
    }

    return {
      userId: payload.sub,
    };
  }
}
