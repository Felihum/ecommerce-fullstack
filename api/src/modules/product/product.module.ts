import { Module } from "@nestjs/common";
import { TypeOrmModule, getRepositoryToken } from "@nestjs/typeorm";
import { DataSource, Repository } from "typeorm";
import { TypeOrmTransactionContext } from "@infrastructure/database/typeorm/typeorm-transaction-context";
import { TypeOrmUnitOfWork } from "@infrastructure/database/typeorm/typeorm-unit-of-work";
import { CreateProductUseCase } from "./domain/use-cases/create-product.use-case";
import { ProductEntity, ProductTypeOrmRepository } from "./infrastructure/product.typeorm.repository";
import { ProductController } from "./presentation/product.controller";
import { ProductRepositoryInterface } from "./domain/contracts/product.repository.interface";
import { UpdateProductUseCase } from "./domain/use-cases/update-product.use-case";
import { ListProductsUseCase } from "./domain/use-cases/list-products.use-case";
import { AuthModule } from "@modules/auth/auth.module";

export const PRODUCT_TOKENS = {
  UNIT_OF_WORK: Symbol("UNIT_OF_WORK"),
  PRODUCT_REPOSITORY: Symbol("PRODUCT_REPOSITORY")
};

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductEntity,
    ]),
    AuthModule
  ],

  controllers: [
    ProductController,
  ],

  providers: [
    TypeOrmTransactionContext,
    {
      provide: PRODUCT_TOKENS.PRODUCT_REPOSITORY,
      useFactory: (
        repository: Repository<ProductEntity>,
      ) => new ProductTypeOrmRepository(
        repository,
      ),
      inject: [
        getRepositoryToken(ProductEntity),
        TypeOrmTransactionContext,
      ],
    },
    {
      provide: PRODUCT_TOKENS.UNIT_OF_WORK,
      useFactory: (
        dataSource: DataSource,
      ) => new TypeOrmUnitOfWork(dataSource),
      inject: [
        DataSource,
      ],
    },
    {
      provide: ListProductsUseCase,
      useFactory: (
        productRepository: ProductRepositoryInterface,
      ) => new ListProductsUseCase(
        productRepository,
      ),
      inject: [
        PRODUCT_TOKENS.PRODUCT_REPOSITORY,
      ],
    },
    {
      provide: CreateProductUseCase,
      useFactory: (
        productRepository: ProductRepositoryInterface,
      ) => new CreateProductUseCase(
        productRepository,
      ),
      inject: [
        PRODUCT_TOKENS.PRODUCT_REPOSITORY,
      ],
    },
    {
      provide: UpdateProductUseCase,
      useFactory: (
        productRepository: ProductRepositoryInterface,
      ) => new UpdateProductUseCase(
        productRepository,
      ),
      inject: [
        PRODUCT_TOKENS.PRODUCT_REPOSITORY,
      ],
    },
  ],

  exports: [
    ListProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase
  ],
})
export class ProductModule {}
