// interfaces/notification.interface.ts
export interface NotificationPayload {
  title: string;
  body: string;
  data?: { [key: string]: string };
}
