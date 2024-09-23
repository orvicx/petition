import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
// 다른 모듈들 임포트
import { TodoModule } from './todo/todo.module';
import { UserModule } from './user/user.module';
import { PdfModule } from './pdf/pdf.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    TodoModule,
    UserModule,
    PdfModule,
    NotificationsModule,
    CommonModule,
  ],
})
export class AppModule {}
