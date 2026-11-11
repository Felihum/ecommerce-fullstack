import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { User } from "../models/auth.entity";

export interface UserRepositoryInterface{
    list(): Promise<User[]>;
    findById(id: ULID): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    insert(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: ULID): Promise<void>;
}