import { Global, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppDataSource } from "./data-source";
import { TypeOrmUnitOfWork } from "./typeorm-unit-of-work";
import { DataSource } from "typeorm";

@Global()
@Module({
  imports: [
    TypeOrmModule.forRoot(AppDataSource.options),
  ],
  providers:[
    {
      provide: TypeOrmUnitOfWork,
      useFactory: (
        dataSource: DataSource,
      ) => new TypeOrmUnitOfWork(dataSource),
      inject: [
        DataSource,
      ],
    }
  ],
  exports: [
    TypeOrmModule,
    TypeOrmUnitOfWork
  ],
})
export class DatabaseModule {}