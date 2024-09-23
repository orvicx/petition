import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../services/notifications.service';
import { SendNotificationDto } from '../dto/send-notification.dto';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { BatchResponse } from 'firebase-admin/lib/messaging/messaging-api'; // BatchResponse로 수정

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async sendNotification(
    @Body() sendNotificationDto: SendNotificationDto,
  ): Promise<BatchResponse> {
    const { registrationTokens, payload } = sendNotificationDto;
    return await this.notificationsService.sendNotification(
      registrationTokens,
      payload,
    );
  }
}
