import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity("addresses")
export class AddressEntity {
  @PrimaryColumn({ type: "varchar", length: 26 })
  id: string;

  @Column({ type: "varchar", length: 255 })
  street: string;

  @Column({ type: "int" })
  number: number;

  @Column({ type: "varchar", length: 255 })
  complement: string;

  @Column({ type: "varchar", length: 8 })
  cep: string;
}