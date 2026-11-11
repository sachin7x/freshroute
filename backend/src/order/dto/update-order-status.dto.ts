/*
 * FreshRoute Backend - Update Order Status DTO
 */

import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsString()
  @IsNotEmpty()
  status!: string;
}