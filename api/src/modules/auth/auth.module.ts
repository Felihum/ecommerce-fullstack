import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AuthController } from "./presentation/controllers/auth.controller";
import { UserRepositoryInterface } from "./domain/contracts/user.repository.interface";
import { SessionRepositoryInterface } from "./domain/contracts/session.repository.interface";
import { UserEntity, UserTypeormRepository } from "./infrastructure/repositories/user.typeorm.repository";
import { SessionEntity, SessionTypeOrmRepository } from "./infrastructure/repositories/session.typeorm.repository";
import { AddressEntity } from "./infrastructure/repositories/address.typeorm.repository";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";
import { LoginUseCase } from "./domain/use-cases/login.use-case";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";
import { PasswordHasherInterface } from "./domain/contracts/password.hasher.interface";
import { TokenProviderInterface } from "./domain/contracts/token.provider.interface";
import { TokenHasherInterface } from "./domain/contracts/token.hasher.interfacer";
import { UlidGenerator } from "@infrastructure/identity/ulid/ulid.generator";
import { TypeOrmUnitOfWork } from "@infrastructure/database/typeorm/typeorm-unit-of-work";
import { Sha256Hasher } from "@infrastructure/cryptography/sha256/sha256.hasher";
import { JwtTokenProvider } from "@infrastructure/authentication/jwt/jwt.provider";
import { Argon2Hasher } from "@infrastructure/cryptography/argon2/argon2.hasher";
import { RegisterUseCase } from "./domain/use-cases/register.use-case";
import { AuthenticateAccessTokenUseCase } from "./domain/use-cases/authenticate-access-token.use-case";
import { AuthenticationGuard } from "@infrastructure/authentication/guards/authentication.guard";
import { RefreshTokenUseCase } from "./domain/use-cases/refresh-token.use-case";
import { DatabaseModule } from "@infrastructure/database/typeorm/typeorm.module";

export const AUTH_TOKENS = {
  ID_GENERATOR: Symbol("ID_GENERATOR"),
  PASSWORD_HASHER: Symbol("PASSWORD_HASHER"),
  TOKEN_PROVIDER: Symbol("TOKEN_PROVIDER"),
  TOKEN_HASHER: Symbol("TOKEN_HASHER"),
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      SessionEntity,
      AddressEntity,
    ]),
    DatabaseModule
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    {
      provide: UserTypeormRepository,
      useFactory: (
        repository: Repository<UserEntity>,
      ) => new UserTypeormRepository(repository),
      inject: [
        getRepositoryToken(UserEntity),
      ],
    },
    {
      provide: SessionTypeOrmRepository,
      useFactory: (
        repository: Repository<SessionEntity>,
      ) => new SessionTypeOrmRepository(
        repository,
      ),
      inject: [
        getRepositoryToken(SessionEntity),
      ],
    },
    {
      provide: AUTH_TOKENS.ID_GENERATOR,
      useFactory: () => new UlidGenerator(),
    },
    {
      provide: AUTH_TOKENS.PASSWORD_HASHER,
      useFactory: () => new Argon2Hasher(),
    },
    {
      provide: AUTH_TOKENS.TOKEN_PROVIDER,
      useFactory: () => new JwtTokenProvider(),
    },
    {
      provide: AUTH_TOKENS.TOKEN_HASHER,
      useFactory: () => new Sha256Hasher(),
    },
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        sessionRepository: SessionRepositoryInterface,
        passwordHasher: PasswordHasherInterface,
        tokenProvider: TokenProviderInterface,
        tokenHasher: TokenHasherInterface,
        unitOfWork: UnitOfWorkInterface,
      ) => new LoginUseCase(
        userRepository,
        sessionRepository,
        passwordHasher,
        tokenProvider,
        tokenHasher,
        unitOfWork,
      ),
      inject: [
        UserTypeormRepository,
        SessionTypeOrmRepository,
        AUTH_TOKENS.PASSWORD_HASHER,
        AUTH_TOKENS.TOKEN_PROVIDER,
        AUTH_TOKENS.TOKEN_HASHER,
        TypeOrmUnitOfWork,
      ],
    },
    {
      provide: RegisterUseCase,
      useFactory: (
        userRepository: UserRepositoryInterface,
        passwordHasher: PasswordHasherInterface,
      ) => new RegisterUseCase(
        userRepository,
        passwordHasher,
      ),
      inject: [
        UserTypeormRepository,
        AUTH_TOKENS.PASSWORD_HASHER,
      ],
    },
    {
      provide: AuthenticateAccessTokenUseCase,
      useFactory: (
        tokenProvider: TokenProviderInterface,
        sessionRepository: SessionRepositoryInterface,
      ) => new AuthenticateAccessTokenUseCase(
        tokenProvider,
        sessionRepository
      ),
      inject: [
        AUTH_TOKENS.TOKEN_PROVIDER,
        SessionTypeOrmRepository
      ]
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        sessionRepository: SessionRepositoryInterface,
        tokenProvider: TokenProviderInterface,
        tokenHasher: TokenHasherInterface,
        unitOfWork: UnitOfWorkInterface
      ) => new RefreshTokenUseCase(
        sessionRepository,
        tokenProvider,
        tokenHasher,
        unitOfWork
      ),
      inject: [
        SessionTypeOrmRepository,
        AUTH_TOKENS.TOKEN_PROVIDER,
        AUTH_TOKENS.TOKEN_HASHER,
        TypeOrmUnitOfWork
      ]
    },
    AuthenticationGuard
  ],

  exports: [
    UserTypeormRepository,
    LoginUseCase,
    RegisterUseCase,
    AuthenticationGuard,
    AuthenticateAccessTokenUseCase,
    RefreshTokenUseCase
  ],
})
export class AuthModule {}
