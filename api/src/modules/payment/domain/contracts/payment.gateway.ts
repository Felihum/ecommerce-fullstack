import { PaymentStatus } from "../models/payment-status.state-machine";

export interface CreatePixPaymentDTO {
    externalReference: string;
    amount: number;
    description: string;
    expiresAt: Date;
    customer: {
        name: string;
        email: string;
        document: string;
    };
}

export interface PixPaymentResponseDTO {
    providerPaymentId: string;
    status: string;
    pix: {
        copyPaste: string;
        qrCode: string;
        expiresAt: Date;
    };
}

export interface PaymentStatusResponseDTO {
    providerPaymentId: string;
    externalReference: string;
    status: PaymentStatus;
    amount: number;
    paidAt?: Date;
}

export interface PaymentGatewayInterface {

    createPixPayment(
        input: CreatePixPaymentDTO,
    ): Promise<PixPaymentResponseDTO>;

    getPaymentStatus(
        providerPaymentId: string,
    ): Promise<PaymentStatusResponseDTO>;

    cancelPayment(
        providerPaymentId: string,
    ): Promise<void>;

    refundPayment(
        providerPaymentId: string,
        amount?: number,
    ): Promise<void>;
}
