import { Module } from '@nestjs/common';
import { NotificationModule } from '@src/modules/core/notification/notification.module';

@Module({
  imports: [NotificationModule],
  exports: [NotificationModule],
})
export class CoreModule {}
