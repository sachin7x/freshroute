/*
 * FreshRoute Backend - Auth Guard
 *
 * JWT validation & Role-based authorization guard.
 */

import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  private jwtService: JwtService;

  constructor(private reflector: Reflector) {
    this.jwtService = new JwtService({
      secret: process.env.JWT_SECRET || 'dev-secret-change-me',
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = this.jwtService.verify(token);
        request.user = {
          id: payload.id || payload.sub,
          email: payload.email,
          role: payload.role,
        };
      } catch (err) {
        if (!isPublic) {
          throw new UnauthorizedException('Invalid or expired authentication token');
        }
      }
    }

    if (isPublic) {
      return true;
    }

    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    // Check roles if specified
    const roles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException(`Role ${request.user.role} does not have required permissions`);
    }

    return true;
  }
}
