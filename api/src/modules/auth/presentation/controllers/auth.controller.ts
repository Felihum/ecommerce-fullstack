import { LoginUseCase, type LoginInput } from "@modules/auth/domain/use-cases/login.use-case";
import { type RefreshTokenInput, RefreshTokenUseCase } from "@modules/auth/domain/use-cases/refresh-token.use-case";
import { RegisterUseCase, type RegisterInput } from "@modules/auth/domain/use-cases/register.use-case";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController{

    constructor(
        private readonly loginUseCase: LoginUseCase,
        private readonly registerUseCase: RegisterUseCase,
        private readonly refreshTokenUseCase: RefreshTokenUseCase
    ){}

    @Post("/login")
    async login(@Body() input: LoginInput){
        return this.loginUseCase.execute(input)
    }

    @Post("/register")
    async register(@Body() input: RegisterInput){
        return this.registerUseCase.execute(input)
    }

    @Post('/refresh')
    async refresh(@Body() input: RefreshTokenInput){
        return this.refreshTokenUseCase.execute(input);
    }
}