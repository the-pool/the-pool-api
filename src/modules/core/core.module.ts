import { Module } from '@nestjs/common';
import { NotificationModule } from '@src/modules/core/notification/notification.module';
import { AuthModule } from '@src/modules/core/auth/auth.module';

@Module({
  imports: [NotificationModule, AuthModule],
  exports: [NotificationModule, AuthModule],
})
export class CoreModule {}
