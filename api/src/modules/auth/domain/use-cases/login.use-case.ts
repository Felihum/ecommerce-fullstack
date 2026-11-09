import { Email } from "@shared/domain/value-objects/email.vo";
import { UserRepositoryInterface } from "../contracts/user.repository.interface";
import { IncorrectCredentialsException } from "../exceptions/incorrect-credentials.exception";
import { PasswordHasherInterface } from "../contracts/password.hasher.interface";
import { User } from "../models/auth.entity";
import { TokenProviderInterface } from "../contracts/token.provider.interface";
import { SessionRepositoryInterface } from "../contracts/session.repository.interface";
import { Session } from "../models/session.entity";
import { TokenHasherInterface } from "../contracts/token.hasher.interfacer";
import { UnitOfWorkInterface } from "@infrastructure/database/contracts/unit-of-work.interface";

interface LoginInput{
    email: string,
    password: string
}

interface LoginOutput{
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
        const user: User = await this.userRepository.findByEmail(Email.create(input.email).toString());

        if (user == null){
            throw new IncorrectCredentialsException();
        }

        if(!this.passwordHasher.compare(input.password, user.password)){
            throw new IncorrectCredentialsException();
        }

        return this.unitOfWork.execute(async (context) => {
            const session = Session.create(user.id.toString());
            const storedSession = await this.sessionRepository.insert(session, context);

            const accessToken = await this.tokenProvider.generateAccessToken({ 
                sub: user.id.toString(), 
                sessionId: storedSession.id.toString(),
            });

            const refreshToken = await this.tokenProvider.generateRefreshToken({ 
                sub: user.id.toString(), 
                sessionId: storedSession.id.toString(),
            });

            storedSession.update(
                this.tokenHasher.encrypt(refreshToken.value), 
                new Date(Date.now() + refreshToken.duration),
            );

            await this.sessionRepository.update(storedSession, context);

            return {
                accessToken: accessToken.value,
                refreshToken: refreshToken.value
            }
        })
    }
}