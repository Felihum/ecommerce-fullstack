import { Email } from "@shared/domain/value-objects/email.vo";
import { UserRepositoryInterface } from "../contracts/user.repository.interface";
import { IncorrectCredentialsException } from "../exceptions/incorrect-credentials.exception";
import { PasswordHasherInterface } from "../contracts/password.hasher.interface";
import { TokenProviderInterface } from "../contracts/token.provider.interface";
import { SessionRepositoryInterface } from "../contracts/session.repository.interface";
import { Session } from "../models/session.entity";
import { TokenHasherInterface } from "../contracts/token.hasher.interfacer";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";

export interface LoginInput{
    email: string,
    password: string
}

export interface LoginOutput{
    accessToken: string,
    refreshToken: string
}

export class LoginUseCase{
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly sessionRepository: SessionRepositoryInterface,
        private readonly passwordHasher: PasswordHasherInterface,
        private readonly tokenProvider: TokenProviderInterface,
        private readonly tokenHasher: TokenHasherInterface,
        private readonly unitOfWork: UnitOfWorkInterface
    ){}

    public async execute(input: LoginInput): Promise<LoginOutput>{
        const user = await this.userRepository.findByEmail(Email.create(input.email).toString());

        if (user == null){
            throw new IncorrectCredentialsException();
        }

        const passwordMatch = await this.passwordHasher.compare(input.password, user.password)

        if(!passwordMatch){
            throw new IncorrectCredentialsException();
        }

        const accessToken = await this.tokenProvider.generateAccessToken({ userId: user.id.toString() });
        const refreshToken = await this.tokenProvider.generateRefreshToken({ userId: user.id.toString() });

        const session = new Session(
            user.id, 
            this.tokenHasher.encrypt(refreshToken.value), 
            new Date(Date.now() + refreshToken.duration)
        );

        await this.sessionRepository.patch(session);

        return {
            accessToken: accessToken.value,
            refreshToken: refreshToken.value
        }
    }
}