// typeorm-unit-of-work.ts
import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { UnitOfWorkInterface } from '../contracts/unit-of-work.interface';
import { TypeOrmTransactionContext } from './typeorm-transaction-context';

@Injectable()
export class TypeOrmUnitOfWork implements UnitOfWorkInterface {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  async execute<T>(callback: (context: TypeOrmTransactionContext) => Promise<T>): Promise<T> {
    return this.dataSource.transaction(async (manager) => {
      const context = new TypeOrmTransactionContext(manager);

      return callback(context);
    });
  }
}