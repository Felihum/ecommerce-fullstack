import { TransactionContextInterface } from "./transaction-context.interface";

export interface UnitOfWorkInterface{
    execute<T>(callback: (context: TransactionContextInterface) => Promise<T>): Promise<T>;
}