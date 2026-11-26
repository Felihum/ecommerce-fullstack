import { Body, Controller, Post } from "@nestjs/common";
import { PaymentEventDispatcher } from "../domain/handlers/payment-event.dispatcher";
import { EventAlreadyProcessedException } from "@infrastructure/idempotency/domain/exceptions/event-already-processed.exception";

@Controller("webhook/payment")
export class PaymentWebhookController {
    constructor(
        private readonly paymentEventDispatcher: PaymentEventDispatcher,
    ){}

    @Post("")
    async handleEvent(@Body() providerEvent: unknown){
        try{
            await this.paymentEventDispatcher.execute(providerEvent)

            return { received: true }
        } catch(error){
            if(error instanceof EventAlreadyProcessedException){
                return { received: true }
            } else {
                throw error
            }
        }
    }
}