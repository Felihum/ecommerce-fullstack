import { CEP } from "@shared/domain/value-objects/cep.vo";
import { CPF } from "@shared/domain/value-objects/cpf.vo";
import { Email } from "@shared/domain/value-objects/email.vo";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Address {
    private constructor(
        public readonly id: ULID,
        public street: string,
        public number: number,
        public complement: string,
        public cep: CEP
    ){}

    static create(
        street: string,
        number: number,
        complement: string,
        cep: CEP,
    ){
        return new Address(
            ULID.create(), 
            street, 
            number, 
            complement, 
            cep
        );
    }
}

export class User {
    private constructor(
        public readonly id: ULID,
        public cpf: CPF,
        public name: string,
        public email: Email,
        public password: string,
        public birthday: Date,
        public addressId: ULID
    ){}

    static create(
        cpf: string,
        name: string,
        email: string,
        password: string,
        birthday: Date,
        addressId: string
    ){
        return new User(
            ULID.create(),
            CPF.create(cpf),
            name,
            Email.create(email),
            password,
            birthday,
            ULID.from(addressId)
        );
    }
}