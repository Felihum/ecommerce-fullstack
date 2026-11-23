import { Body, Controller, Post } from "@nestjs/common";
import { type CreateOrderInput, CreateOrderUseCase } from "../domain/use-cases/create-order.use-case";
import { Authenticated } from "@infrastructure/authentication/decorators/authenticated.decorator";
import { CurrentUser } from "@infrastructure/authentication/decorators/current-user.decorator";
import { type AuthenticatedUserOutput } from "@modules/auth/domain/use-cases/authenticate-access-token.use-case";

@Controller("order")
export class OrderController {
    constructor(
        private readonly createOrderUseCase: CreateOrderUseCase
    ){}

    @Authenticated()
    @Post("")
    async create(@Body() input: CreateOrderInput, @CurrentUser() user: AuthenticatedUserOutput){
        console.log(input)
        return await this.createOrderUseCase.execute(user.userId, input)
    }
}