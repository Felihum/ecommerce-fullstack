import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { ProductRepositoryInterface } from "../contracts/product.repository.interface";
import { ProductNotFoundException } from "../exception/product-not-found.exception";

export interface UpdateProductInput{
    title?: string,
    description?: string,
    price?: number,
    contentUrl?: string,
    imageUrl?: string,
}

export class UpdateProductUseCase{
    constructor(
        private readonly productRepository: ProductRepositoryInterface
    ){}

    async execute(id: string, input: UpdateProductInput){
        const productId = ULID.from(id)

        const product = await this.productRepository.findById(productId)

        if(!product){
            throw new ProductNotFoundException()
        }
        
        if(input.title) product.title = input.title
        if(input.description) product.description = input.description
        if(input.price) product.price = input.price
        if(input.contentUrl) product.contentUrl = input.contentUrl
        if(input.imageUrl) product.imageUrl = input.imageUrl

        const productUpdated = await this.productRepository.update(product)
        return productUpdated.toDict()
    }
}