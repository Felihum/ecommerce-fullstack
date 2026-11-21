import { Module } from "@nestjs/common";
import { ProcessPaymentsExecutor } from "./domain/executors/process-payments.executor";

@Module({
    providers: [
        ProcessPaymentsExecutor,
    ],
    exports: [
        ProcessPaymentsExecutor,
    ],
})
export class PaymentModule {}