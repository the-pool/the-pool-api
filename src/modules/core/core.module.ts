import { Module } from '@nestjs/common';
import { NotificationModule } from '@src/modules/core/notification/notification.module';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';

@Module({
  imports: [NotificationModule, AuthModule, PrismaModule],
  exports: [NotificationModule, AuthModule, PrismaModule],
})
export class CoreModule {}
