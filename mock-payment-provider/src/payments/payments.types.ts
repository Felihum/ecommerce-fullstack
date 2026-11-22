/* eslint-disable prettier/prettier */

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  PIX = 'PIX',
}

export enum PaymentEvent {
  CREATED = 'payment.created',
  CONFIRMED = 'payment.confirmed',
  EXPIRED = 'payment.expired',
  CANCELLED = 'payment.cancelled',
  REFUNDED = 'payment.refunded',
}

export interface PaymentCustomer {
  name: string;
  email: string;
  document: string;
}

export interface PixData {
  qrCode: string;
  qrCodeText: string;
  expiresAt: Date;
}

export interface Payment {
  id: string;
  externalReference: string;
  amount: number;
  currency: 'BRL';
  description: string;
  method: PaymentMethod;
  status: PaymentStatus;
  customer: PaymentCustomer;
  pix: PixData;
  createdAt: Date;
  updatedAt: Date;
  paidAt?: Date;
  refundedAt?: Date;
}

export interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason?: string;
  createdAt: Date;
}

export interface PaymentWebhook {
  id: string;
  event: PaymentEvent;
  createdAt: Date;
  data: {
    paymentId: string;
    externalReference: string;
    amount: number;
    status: PaymentStatus;
    paidAt?: Date;
  };
}
