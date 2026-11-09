import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { AddressEntity } from "./address.typeorm.repository";

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

  @Column({ type: "date" })
  birthday: Date;

  @ManyToOne(() => AddressEntity, {
    nullable: false,
  })
  @JoinColumn({ name: "address_id" })
  address: AddressEntity;
}