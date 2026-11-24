import { Body, Controller, Post } from "@nestjs/common";
import { PaymentEventDispatcher } from "../domain/handlers/payment-event.dispatcher";

@Controller("webhook/payment")
export class PaymentWebhookController {
    constructor(
        private readonly paymentEventDispatcher: PaymentEventDispatcher,
    ){}

    @Post("")
    async handleEvent(@Body() providerEvent: unknown){
        await this.paymentEventDispatcher.execute(providerEvent)

        return { received: true }
    }
}