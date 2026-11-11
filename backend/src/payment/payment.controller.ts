/*
 * FreshRoute Backend - Payment Controller
 *
 * HTTP endpoints for payment processing:
 * - POST /api/payments/initiate - Create Razorpay order
 * - POST /api/payments/verify - Verify payment signature
 * - POST /api/payments/webhook - Razorpay webhook handler
 * - GET /api/payments/:orderId - Get payment status
 */

import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { InitiatePaymentDto } from './dto/initiate-payment.dto';
import { VerifyPaymentDto } from './dto/verify-payment.dto';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('initiate')
  @UseGuards(AuthGuard)
  async initiatePayment(@Request() req: any, @Body() dto: InitiatePaymentDto) {
    return this.paymentService.initiatePayment(req.user?.id, dto);
  }

  @Post('verify')
  @UseGuards(AuthGuard)
  async verifyPayment(@Body() dto: VerifyPaymentDto) {
    return this.paymentService.verifyPayment(dto);
  }

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Query('signature') signature: string) {
    return this.paymentService.handleWebhook(body, signature);
  }

  @Get(':orderId')
  @UseGuards(AuthGuard)
  async getPayment(@Param('orderId') orderId: string, @Request() req: any) {
    return this.paymentService.getPayment(orderId, req.user?.id);
  }
}
