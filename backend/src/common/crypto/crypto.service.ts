/*
 * FreshRoute Backend - Crypto Service
 *
 * Utility for generating OTP codes and cryptographic helpers.
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  generateOTP(length: number = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return otp;
  }

  hashPassword(password: string): string {
    return password; // In production, use bcrypt
  }
}