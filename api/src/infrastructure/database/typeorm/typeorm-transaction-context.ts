import { EntityManager } from "typeorm";
import { TransactionContextInterface } from "../contracts/transaction-context.interface";

export class TypeOrmTransactionContext implements TransactionContextInterface{
    constructor(
        public readonly manager: EntityManager
    ){}
}