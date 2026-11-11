import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  @IsNotEmpty()
  orderId?: string;

  @IsString()
  @IsOptional()
  serviceCode?: string;

  @IsString()
  @IsOptional()
  pickupSlotId?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsNotEmpty()
  totalAmount!: number;

  @IsNumber()
  @IsNotEmpty()
  finalAmount!: number;
}
