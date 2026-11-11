/*
 * FreshRoute Backend - Auth Controller
 *
 * HTTP endpoints for authentication:
 * - POST /api/v1/auth/register - Register new user
 * - POST /api/v1/auth/login - Login with phone/password
 * - POST /api/v1/auth/verify-otp - Verify OTP code
 * - POST /api/v1/auth/refresh-token - Refresh JWT
 * - POST /api/v1/auth/logout - Logout and revoke tokens
 * - GET /api/v1/auth/me - Get current user profile
 */

import { Controller, Post, Body, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Public } from '../common/decorators/public.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() body: { phone: string; otp: string }) {
    return this.authService.verifyOtp(body.phone, body.otp);
  }

  @Public()
  @Post('refresh-token')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshToken(body.refreshToken);
  }

  @Post('logout')
  @UseGuards(AuthGuard)
  async logout(@Request() req: any) {
    return this.authService.logout(req.user?.id);
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async getMe(@Request() req: any) {
    return this.authService.getProfile(req.user?.id);
  }
}
