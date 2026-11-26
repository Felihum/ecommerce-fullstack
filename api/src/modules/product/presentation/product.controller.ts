import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { type CreateProductInput, CreateProductUseCase } from "../domain/use-cases/create-product.use-case";
import { type UpdateProductInput, UpdateProductUseCase } from "../domain/use-cases/update-product.use-case";
import { ListProductsUseCase } from "../domain/use-cases/list-products.use-case";
import { Authenticated } from "@infrastructure/authentication/decorators/authenticated.decorator";

@Controller("product")
export class ProductController{

    constructor(
        private readonly listProductsUseCase: ListProductsUseCase,
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase
    ){}

    @Get("")
    async list(){
        return this.listProductsUseCase.execute()
    }

    @Authenticated()
    @Post("")
    async create(@Body() input: CreateProductInput){
        return this.createProductUseCase.execute(input)
    }
    
    @Authenticated()
    @Patch(":id")
    async update(@Param('id') id: string, @Body() input: UpdateProductInput){
        return this.updateProductUseCase.execute(id, input)
    }
}