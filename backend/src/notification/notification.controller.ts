/*
 * FreshRoute Backend - Notification Controller
 *
 * HTTP endpoints for notifications:
 * - GET /api/notifications - List user notifications
 * - PUT /api/notifications/:id/read - Mark as read
 */

import { Controller, Get, Put, Param, Request, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthGuard } from '../common/guards/auth.guard';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @Get()
  @UseGuards(AuthGuard)
  async listNotifications(@Request() req: any) {
    return this.notificationService.listNotifications(req.user?.id);
  }

  @Put(':id/read')
  @UseGuards(AuthGuard)
  async markAsRead(@Param('id') id: string, @Request() req: any) {
    return this.notificationService.markAsRead(id, req.user?.id);
  }
}
