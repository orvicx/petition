import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { NotificationPayload } from '../interfaces/notification.interface';

@Injectable()
export class NotificationsService {
  async sendNotification(
    registrationTokens: string[],
    payload: NotificationPayload,
  ): Promise<admin.messaging.BatchResponse> {
    const message: admin.messaging.MulticastMessage = {
      tokens: registrationTokens,
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data,
    };

    return await admin.messaging().sendMulticast(message);
  }
}
