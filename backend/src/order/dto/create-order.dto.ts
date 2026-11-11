/*
 * FreshRoute Backend - Create Order DTO
 */

import { IsString, IsInt, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  serviceCode!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  cityCode!: string;

  @IsString()
  @IsNotEmpty()
  addressId!: string;

  @IsInt()
  quantity!: number;

  @IsOptional()
  @IsString()
  pickupSlotId?: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}