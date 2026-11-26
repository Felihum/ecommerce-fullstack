import { ProductRepositoryInterface } from "../contracts/product.repository.interface";
import { Product } from "../models/product.entity";

export interface CreateProductInput{
    title: string,
    description: string,
    price: number,
    contentUrl: string
    imageUrl: string,
}

export class CreateProductUseCase{
    constructor(
        private readonly productRepository: ProductRepositoryInterface
    ){}

    async execute(input: CreateProductInput){
        const product = new Product(
            input.title, 
            input.description, 
            input.price, 
            input.contentUrl, 
            input.imageUrl, 
        )

        const productPersisted = await this.productRepository.insert(product)
        
        return productPersisted.toDict()
    }
}