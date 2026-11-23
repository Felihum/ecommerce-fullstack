import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '@modules/product/product.module';
import { DatabaseModule } from '@infrastructure/database/typeorm/typeorm.module';
import { OrderModule } from '@modules/order/order.module';
import { PaymentModule } from '@modules/payment/payment.module';

@Module({
  imports: [
    // TypeOrmModule.forRoot({
    //   type: "postgres",
    //   host: process.env.DATABASE_HOST,
    //   port: Number(process.env.POSTGRES_PORT),
    //   username: process.env.POSTGRES_USER,
    //   password: process.env.POSTGRES_PASSWORD,
    //   database: process.env.POSTGRES_DB,
    //   autoLoadEntities: true,
    //   synchronize: false,
    // }),
    DatabaseModule,
    AuthModule,
    OrderModule,
    PaymentModule,
    ProductModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
