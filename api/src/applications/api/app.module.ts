import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { ProductModule } from '@modules/product/product.module';
import { DatabaseModule } from '@infrastructure/database/typeorm/typeorm.module';
import { OrderModule } from '@modules/order/order.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { PurchaseModule } from '@modules/purchase/purchase.module';
import { IdempotencyModule } from '@infrastructure/idempotency/idempotency.module';
import { S3StorageModule } from '@infrastructure/storage/storage.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    OrderModule,
    PaymentModule,
    ProductModule,
    PurchaseModule,
    IdempotencyModule,
    S3StorageModule,
  ],
})
export class AppModule {}
