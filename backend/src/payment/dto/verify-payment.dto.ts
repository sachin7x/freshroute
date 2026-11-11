import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyPaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId!: string;

  @IsString()
  @IsNotEmpty()
  providerOrderId!: string;

  @IsString()
  @IsNotEmpty()
  providerPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  signature!: string;
}
