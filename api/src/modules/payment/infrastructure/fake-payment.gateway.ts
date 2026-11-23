import { CreatePixPaymentDTO, PaymentGatewayInterface, PaymentStatusResponseDTO, PixPaymentResponseDTO } from "../domain/contracts/payment.gateway";
import { PaymentStatus } from "../domain/models/payment-status.state-machine";

export class FakePaymentGateway implements PaymentGatewayInterface {

    async createPixPayment(
        input: CreatePixPaymentDTO,
    ): Promise<PixPaymentResponseDTO> {
        return {
            providerPaymentId: "mock-payment-123",
            status: "PENDING",
            pix: {
                copyPaste: "00020126580014BR.GOV.BCB.PIX",
                qrCode: "mock-qr-code",
                expiresAt: input.expiresAt,
            },
        };
    }

    async getPaymentStatus(
        providerPaymentId: string,
    ): Promise<PaymentStatusResponseDTO> {
        return {
            providerPaymentId: "mock-payment-123",
            externalReference: "mock-external-reference",
            status: PaymentStatus.PENDING,
            amount: 100,
        };
    }

    async cancelPayment(
        providerPaymentId: string,
    ): Promise<void> {
        return;
    }

    async refundPayment(
        providerPaymentId: string,
        amount?: number,
    ): Promise<void> {
        return;
    }
}