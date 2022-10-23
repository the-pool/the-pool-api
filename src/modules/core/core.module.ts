import { Module } from '@nestjs/common';
import { NotificationModule } from '@src/modules/core/notification/notification.module';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { HttpConfigModule } from './http/http-config.module';

@Module({
  imports: [NotificationModule, AuthModule, PrismaModule, HttpConfigModule],
  exports: [NotificationModule, AuthModule, PrismaModule, HttpConfigModule],
})
export class CoreModule {}
