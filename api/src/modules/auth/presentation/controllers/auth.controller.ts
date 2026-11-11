import { LoginUseCase, type LoginInput } from "@modules/auth/domain/use-cases/login.use-case";
import { Body, Controller, Post } from "@nestjs/common";

@Controller("auth")
export class AuthController{

    constructor(
        private readonly loginUseCase: LoginUseCase
    ){}

    @Post("/login")
    async login(@Body() input: LoginInput){
        const loginInput: LoginInput = {
            email: input.email,
            password: input.password
        }

        return this.loginUseCase.execute(loginInput)
    }
}