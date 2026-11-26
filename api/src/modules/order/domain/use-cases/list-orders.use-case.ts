import { RequestMetadata } from "@shared/domain/dtos/metadata.dto";
import { OrderRepositoryInterface } from "../contracts/order.repository";

export class ListOrdersUseCase {
    
    constructor(
        private readonly orderRepository: OrderRepositoryInterface
    ){}

    async execute(metadata?: RequestMetadata){

    }
}