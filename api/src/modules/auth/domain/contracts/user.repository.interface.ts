import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { User } from "../models/auth.entity";

export interface UserRepositoryInterface{
    list(): Promise<User[]>;
    findById(id: ULID): Promise<User>;
    findByEmail(email: string): Promise<User>;
    insert(user: User): Promise<User>;
    update(user: User): Promise<User>;
    delete(id: ULID): Promise<void>;
}