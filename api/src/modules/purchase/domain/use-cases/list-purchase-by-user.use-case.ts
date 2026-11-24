import { PurchaseRepositoryInterface } from "../contracts/purchase.repository";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export interface CreatePurchaseInput {
    userId: string
}

export class ListPurchaseByUserUseCase {
    constructor(
        private readonly purchaseRepository: PurchaseRepositoryInterface,
    ){}

    async execute(input: CreatePurchaseInput){
        return await this.purchaseRepository.listByUserId(ULID.from(input.userId))
    }
}