import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateDateColumn, Repository, UpdateDateColumn } from 'typeorm';
import { ProductRepositoryInterface } from '@modules/product/domain/contracts/product.repository.interface';
import { Product } from '@modules/product/domain/models/product.entity';
import { ULID } from '@shared/domain/value-objects/ulid.vo';
import { TransactionContextInterface } from '@infrastructure/database/contracts/transaction-context.interface';
import { Column, Entity, PrimaryColumn } from 'typeorm';
import { TypeOrmTransactionContext } from '@infrastructure/database/typeorm/typeorm-transaction-context';

@Entity('products')
export class ProductEntity {
    @PrimaryColumn({
        type: 'varchar',
        length: 26,
    })
    id: string;

    @Column({
        type: 'varchar',
        length: 150,
    })
    title: string;

    @Column({
        type: 'text',
    })
    description: string;

    @Column({
        type: 'decimal',
        precision: 10,
        scale: 2,
    })
    price: string;

    @Column({
        type: 'decimal',
        precision: 5,
        scale: 2,
        default: 0,
    })
    discount: number;

    @Column({
        type: 'text',
    })
    imageUrl: string;

    @Column({
        type: 'text',
    })
    contentUrl: string;

    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date;
}

@Injectable()
export class ProductTypeOrmRepository
    implements ProductRepositoryInterface {

    constructor(
        @InjectRepository(ProductEntity)
        private readonly repository: Repository<ProductEntity>,
    ) {}

    private getRepository(
        context?: TransactionContextInterface,
    ): Repository<ProductEntity> {
        if (!context) {
            return this.repository;
        }

        if (!(context instanceof TypeOrmTransactionContext)) {
            throw new Error(
                'Invalid transaction context for TypeORM repository.',
            );
        }

        return context.manager.getRepository(ProductEntity);
    }

    async list(
        context?: TransactionContextInterface,
    ): Promise<Product[]> {
        const repository = this.getRepository(context);

        const entities = await repository.find();

        return entities.map(entity => this.toDomain(entity));
    }

    async findById(
        productId: ULID,
        context?: TransactionContextInterface,
    ): Promise<Product | null> {
        const repository = this.getRepository(context);

        const entity = await repository.findOneBy({
            id: productId.toString(),
        });

        return entity ? this.toDomain(entity) : null;
    }

    async insert(
        product: Product,
        context?: TransactionContextInterface,
    ): Promise<Product> {
        const repository = this.getRepository(context);

        const entity = repository.create(
            this.toPersistence(product),
        );

        const savedEntity = await repository.save(entity);

        return this.toDomain(savedEntity);
    }

    async update(
        product: Product,
        context?: TransactionContextInterface,
    ): Promise<Product> {
        const repository = this.getRepository(context);

        product.updatedAt = new Date()

        const persistence = this.toPersistence(product);

        const result = await repository.update(
            { id: product.id.toString() },
            persistence,
        );

        if (!result.affected) {
            throw new Error('Product not found.');
        }

        const updatedEntity = await repository.findOneByOrFail({
            id: product.id.toString(),
        });

        return this.toDomain(updatedEntity);
    }

    async delete(
        productId: ULID,
        context?: TransactionContextInterface,
    ): Promise<void> {
        const repository = this.getRepository(context);

        await repository.delete({
            id: productId.toString(),
        });
    }

    private toDomain(entity: ProductEntity): Product {
        return new Product(
            entity.title,
            entity.description,
            Number(entity.price),
            entity.contentUrl,
            entity.imageUrl,
            Number(entity.discount),
            ULID.from(entity.id),
            entity.createdAt,
            entity.updatedAt,
        );
    }

    private toPersistence(product: Product): Partial<ProductEntity> {
        return {
            id: product.id.toString(),
            title: product.title,
            description: product.description,
            price: product.price.toString(),
            contentUrl: product.contentUrl,
            discount: product.discount.getValue(),
            imageUrl: product.imageUrl,
            createdAt: product.createdAt,
            updatedAt: product.updatedAt,
        };
    }
}
