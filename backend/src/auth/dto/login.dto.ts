/*
 * FreshRoute Backend - Login DTO
 */

import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(15)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  password!: string;
}