/* eslint-disable prettier/prettier */

import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
  ) {}

  private authenticate(apiKey: string): void {
    const expected = process.env.MOCK_API_KEY;

    if (!expected || apiKey !== expected) {
        throw new UnauthorizedException('Invalid API key');
    }
  }

  private authenticateAdmin(apiKey: string): void {
    const expected = process.env.MOCK_ADMIN_KEY;

    if (!expected || apiKey !== expected) {
        throw new UnauthorizedException('Invalid admin key');
    }
  }

  @Post()
  async create(
    @Headers('x-api-key') apiKey: string,
    @Body() input: CreatePaymentDto,
  ) {
    this.authenticate(apiKey);

    return this.paymentsService.create(input);
  }

  @Get()
  findAll(
    @Headers('x-api-key') apiKey: string,
  ) {
    this.authenticate(apiKey);

    return this.paymentsService.findAll();
  }

  @Get(':id')
  findById(
    @Headers('x-api-key') apiKey: string,
    @Param('id') id: string,
  ) {
    this.authenticate(apiKey);

    return this.paymentsService.findById(id);
  }

  @Post(':id/confirm')
  confirm(
    @Headers('x-mock-admin-key') adminKey: string,
    @Param('id') id: string,
  ) {
    this.authenticateAdmin(adminKey);

    return this.paymentsService.confirm(id);
  }

  @Post(':id/cancel')
  cancel(
    @Headers('x-api-key') apiKey: string,
    @Param('id') id: string,
  ) {
    this.authenticate(apiKey);

    return this.paymentsService.cancel(id);
  }

  @Post(':id/refunds')
  refund(
    @Headers('x-api-key') apiKey: string,
    @Param('id') id: string,
    @Body() input: RefundPaymentDto,
  ) {
    this.authenticate(apiKey);

    return this.paymentsService.refund(id, input);
  }

  @Get('refunds/:id')
  findRefund(
    @Headers('x-api-key') apiKey: string,
    @Param('id') id: string,
  ) {
    this.authenticate(apiKey);

    return this.paymentsService.findRefund(id);
  }
}
