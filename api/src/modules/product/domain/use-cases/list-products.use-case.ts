import { ProductRepositoryInterface } from "../contracts/product.repository.interface";

export class ListProductsUseCase{
    constructor(
        private readonly productRepository: ProductRepositoryInterface
    ){}

    async execute(){
        const products = await this.productRepository.list()
        
        return products.map((product) => product.toDict())
    }
}