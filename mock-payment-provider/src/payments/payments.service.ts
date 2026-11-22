/* eslint-disable prettier/prettier */

import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';

import { randomUUID, createHmac } from 'crypto';
import * as QRCode from 'qrcode';

import {
  Payment,
  PaymentStatus,
  PaymentMethod,
  PaymentEvent,
  PaymentWebhook,
  Refund,
} from './payments.types';

import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly payments = new Map<string, Payment>();
  private readonly refunds = new Map<string, Refund>();

  private readonly webhookUrl = process.env.WEBHOOK_URL;
  private readonly webhookSecret =
    process.env.WEBHOOK_SECRET || 'mock-webhook-secret';

  private readonly timers = new Map<string, NodeJS.Timeout>();

  async create(input: CreatePaymentDto): Promise<Payment> {
    const existing = [...this.payments.values()].find(
      payment =>
        payment.externalReference === input.externalReference,
    );

    if (existing) {
      throw new ConflictException(
        'A payment with this external reference already exists',
      );
    }

    const now = new Date();

    const expiresAt = new Date(
      now.getTime() +
      (input.expiresInSeconds ?? 300) * 1000,
    );

    const id = randomUUID();

    // Código deliberadamente fictício.
    // Não representa uma cobrança PIX válida.
    const qrCodeText = [
      'MOCKPIX',
      id,
      input.amount,
      expiresAt.getTime(),
    ].join('|');

    const qrCode = await QRCode.toDataURL(qrCodeText);

    const payment: Payment = {
      id,
      externalReference: input.externalReference,
      amount: input.amount,
      currency: 'BRL',
      description: input.description,
      method: PaymentMethod.PIX,
      status: PaymentStatus.PENDING,

      customer: input.customer,

      pix: {
        qrCode,
        qrCodeText,
        expiresAt,
      },

      createdAt: now,
      updatedAt: now,
    };

    this.payments.set(id, payment);

    this.scheduleExpiration(payment);

    await this.emitWebhook(
      PaymentEvent.CREATED,
      payment,
    );

    return payment;
  }

  findById(id: string): Payment {
    const payment = this.getPayment(id);

    this.expireIfNecessary(payment);

    return payment;
  }

  findAll(): Payment[] {
    for (const payment of this.payments.values()) {
      this.expireIfNecessary(payment);
    }

    return [...this.payments.values()];
  }

  async confirm(id: string): Promise<Payment> {
    const payment = this.getPayment(id);

    this.expireIfNecessary(payment);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        `Cannot confirm payment with status ${payment.status}`,
      );
    }

    payment.status = PaymentStatus.PAID;
    payment.paidAt = new Date();
    payment.updatedAt = new Date();

    this.clearExpiration(id);

    await this.emitWebhook(
      PaymentEvent.CONFIRMED,
      payment,
    );

    return payment;
  }

  async cancel(id: string): Promise<Payment> {
    const payment = this.getPayment(id);

    this.expireIfNecessary(payment);

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        'Only pending payments can be cancelled',
      );
    }

    payment.status = PaymentStatus.CANCELLED;
    payment.updatedAt = new Date();

    this.clearExpiration(id);

    await this.emitWebhook(
      PaymentEvent.CANCELLED,
      payment,
    );

    return payment;
  }

  async refund(
    id: string,
    input: RefundPaymentDto,
  ): Promise<Refund> {
    const payment = this.getPayment(id);

    if (payment.status !== PaymentStatus.PAID) {
      throw new BadRequestException(
        'Only paid payments can be refunded',
      );
    }

    if (input.amount !== payment.amount) {
      throw new BadRequestException(
        'This mock supports full refunds only',
      );
    }

    const refund: Refund = {
      id: randomUUID(),
      paymentId: payment.id,
      amount: input.amount,
      reason: input.reason,
      createdAt: new Date(),
    };

    this.refunds.set(refund.id, refund);

    payment.status = PaymentStatus.REFUNDED;
    payment.refundedAt = new Date();
    payment.updatedAt = new Date();

    await this.emitWebhook(
      PaymentEvent.REFUNDED,
      payment,
    );

    return refund;
  }

  findRefund(id: string): Refund {
    const refund = this.refunds.get(id);

    if (!refund) {
      throw new NotFoundException('Refund not found');
    }

    return refund;
  }

  private getPayment(id: string): Payment {
    const payment = this.payments.get(id);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  private scheduleExpiration(payment: Payment): void {
    const delay =
      payment.pix.expiresAt.getTime() - Date.now();

    const timer = setTimeout(async () => {
      const current = this.payments.get(payment.id);

      if (
        current &&
        current.status === PaymentStatus.PENDING
      ) {
        current.status = PaymentStatus.EXPIRED;
        current.updatedAt = new Date();

        this.timers.delete(payment.id);

        await this.emitWebhook(
          PaymentEvent.EXPIRED,
          current,
        );
      }
    }, delay);

    this.timers.set(payment.id, timer);
  }

  private expireIfNecessary(payment: Payment): void {
    if (
      payment.status === PaymentStatus.PENDING &&
      payment.pix.expiresAt.getTime() <= Date.now()
    ) {
      payment.status = PaymentStatus.EXPIRED;
      payment.updatedAt = new Date();

      this.clearExpiration(payment.id);

      void this.emitWebhook(
        PaymentEvent.EXPIRED,
        payment,
      );
    }
  }

  private clearExpiration(id: string): void {
    const timer = this.timers.get(id);

    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
  }

  private async emitWebhook(
    event: PaymentEvent,
    payment: Payment,
  ): Promise<void> {
    if (!this.webhookUrl) {
      return;
    }

    const webhook: PaymentWebhook = {
      id: randomUUID(),
      event,
      createdAt: new Date(),
      data: {
        paymentId: payment.id,
        externalReference: payment.externalReference,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt,
      },
    };

    const body = JSON.stringify(webhook);

    const signature = createHmac(
      'sha256',
      this.webhookSecret,
    )
      .update(body)
      .digest('hex');

    // Três tentativas para simular a entrega do webhook.
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(this.webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-mock-signature': signature,
            'x-mock-event-id': webhook.id,
          },
          body,
          signal: AbortSignal.timeout(5000),
        });

        if (response.ok) {
          return;
        }
      } catch {
        // Falha de comunicação: tenta novamente.
      }

      if (attempt < 3) {
        await new Promise(resolve =>
          setTimeout(resolve, attempt * 1000),
        );
      }
    }

    console.error(
      `Failed to deliver webhook ${webhook.id}`,
    );
  }
}
