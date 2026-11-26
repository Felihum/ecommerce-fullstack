import { CEP } from "@shared/domain/value-objects/cep.vo";
import { CPF } from "@shared/domain/value-objects/cpf.vo";
import { Email } from "@shared/domain/value-objects/email.vo";
import { ULID } from "@shared/domain/value-objects/ulid.vo";

export class Address {
    public readonly id: ULID
    public street: string
    public number: number
    public complement: string
    public cep: CEP

    constructor(
        street: string,
        number: number,
        complement: string,
        cep: CEP,
        id?: ULID,
    ){
        this.id = id ?? ULID.create()
        this.street = street
        this.number = number
        this.complement = complement
        this.cep = cep
    }
}

export class User {
    public readonly id: ULID
    public cpf: CPF
    public name: string
    public email: Email
    public password: string
    public addressId: ULID | null

    constructor(
        cpf: CPF,
        name: string,
        email: Email,
        password: string,
        id?: ULID,
        addressId?: ULID,
    ){
        this.id = id ?? ULID.create()
        this.cpf = cpf
        this.name = name
        this.email = email
        this.password = password
        this.addressId = addressId ?? null
    }
}