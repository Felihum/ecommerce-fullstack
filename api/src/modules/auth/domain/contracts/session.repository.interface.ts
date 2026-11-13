import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Session } from "../models/session.entity";
import { TransactionContextInterface } from "@infrastructure/database/contracts/transaction-context.interface";

export interface SessionRepositoryInterface{
    findById(id: ULID, context?: TransactionContextInterface): Promise<Session | null>;
    findByRefreshToken(token: string, context?: TransactionContextInterface): Promise<Session | null>;
    insert(session: Session, context?: TransactionContextInterface): Promise<Session>;
    patch(session: Session, context?: TransactionContextInterface): Promise<Session>;
    update(session: Session, context?: TransactionContextInterface): Promise<Session>;
    delete(id: ULID, context?: TransactionContextInterface): Promise<void>;
}