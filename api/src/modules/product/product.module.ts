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
    {
      provide: ProductTypeOrmRepository,
      useFactory: (
        repository: Repository<ProductEntity>,
      ) => new ProductTypeOrmRepository(
        repository,
      ),
      inject: [
        getRepositoryToken(ProductEntity),
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
        ProductTypeOrmRepository,
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
        ProductTypeOrmRepository,
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
        ProductTypeOrmRepository,
      ],
    },
  ],

  exports: [
    ListProductsUseCase,
    CreateProductUseCase,
    UpdateProductUseCase,
    ProductTypeOrmRepository
  ],
})
export class ProductModule {}
