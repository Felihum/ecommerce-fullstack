import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { Session } from "../models/session.entity";

export interface SessionRepositoryInterface{
    findById(id: ULID): Promise<Session>;
    findByRefreshToken(token: string): Promise<Session>;
    insert(session: Session): Promise<Session>;
    update(session: Session): Promise<Session>;
    delete(id: ULID): Promise<void>;
}