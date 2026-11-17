import { Body, Controller, Post } from "@nestjs/common";
import { type CreateProductInput, CreateProductUseCase } from "../domain/use-cases/create-product.use-case";

@Controller("product")
export class ProductController{

    constructor(
        private readonly createProductUseCase: CreateProductUseCase
    ){}

    @Post("/")
    async login(@Body() input: CreateProductInput){
        return this.createProductUseCase.execute(input)
    }
}