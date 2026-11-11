import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Unique, Repository } from "typeorm";
import { AddressEntity } from "./address.typeorm.repository";
import { User } from "@modules/auth/domain/models/auth.entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ULID } from "@shared/domain/value-objects/ulid.vo";
import { UserRepositoryInterface } from "@modules/auth/domain/contracts/user.repository.interface";
import { InjectRepository } from "@nestjs/typeorm";

@Entity("users")
@Unique(["cpf"])
@Unique(["email"])
export class UserEntity {
  @PrimaryColumn({ type: "varchar", length: 26 })
  id: string;

  @Column({ type: "varchar", length: 11 })
  cpf: string;

  @Column({ type: "varchar", length: 150 })
  name: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @ManyToOne(() => AddressEntity, {
    nullable: true,
  })
  @JoinColumn({ name: "address_id" })
  address: AddressEntity | null;
}


@Injectable()
export class UserTypeormRepository implements UserRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async list(): Promise<User[]> {
    const users = await this.repository.find({
      relations: {
        address: true,
      },
    });

    return users.map((user) => this.toDomain(user));
  }

  async findById(id: ULID): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { id: id.toString() },
      relations: {
        address: true,
      },
    });

    if (!user) return null

    return this.toDomain(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.repository.findOne({
      where: { email },
      relations: {
        address: true,
      },
    });

    if (!user) return null

    return this.toDomain(user);
  }

  async insert(user: User): Promise<User> {
    const entity = this.toPersistence(user);

    const savedUser = await this.repository.save(entity);

    return this.toDomain(savedUser);
  }

  async update(user: User): Promise<User> {
    const entity = this.toPersistence(user);

    const savedUser = await this.repository.save(entity);

    return this.toDomain(savedUser);
  }

  async delete(id: ULID): Promise<void> {
    const result = await this.repository.delete({
      id: id.toString(),
    });

    if (!result.affected) {
      throw new NotFoundException("User not found.");
    }
  }

  private toDomain(entity: UserEntity): User {
    return User.create(
      entity.cpf,
      entity.name,
      entity.email,
      entity.password,
      entity.address ? entity.address.id : undefined,
    )
  }

  private toPersistence(user: User): UserEntity {
    const entity = new UserEntity();

    entity.id = user.id.toString();
    entity.cpf = user.cpf.toString();
    entity.name = user.name;
    entity.email = user.email.toString();
    entity.password = user.password;

    // Adicione aqui a conversão de Address para AddressEntity

    return entity;
  }
}