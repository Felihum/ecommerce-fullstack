import { Email } from "@shared/domain/value-objects/email.vo";
import { UserRepositoryInterface } from "../contracts/user.repository.interface";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists.exception";
import { Password } from "@shared/domain/value-objects/password.vo";
import { User } from "../models/auth.entity";
import { CPF } from "@shared/domain/value-objects/cpf.vo";
import { PasswordHasherInterface } from "../contracts/password.hasher.interface";

export interface RegisterInput{
    cpf: string,
    email: string,
    name: string,
    password: string
}

export class RegisterUseCase{
    constructor(
        private readonly userRepository: UserRepositoryInterface,
        private readonly passwordHasher: PasswordHasherInterface
    ){}

    async execute(input: RegisterInput){
        const cpf = CPF.create(input.cpf)
        const email = Email.create(input.email)
        const password = Password.create(input.password)
        
        const existingUser = await this.userRepository.findByEmail(email.toString())

        if (existingUser){
            throw new UserAlreadyExistsException()
        }

        const passwordHash = await this.passwordHasher.encrypt(password.toString())

        return await this.userRepository.insert(User.create(
            cpf.toString(),
            input.name,
            email.toString(),
            passwordHash
        ))
    }
}