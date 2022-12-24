import { Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { HttpConfigModule } from './http/http-config.module';
import { PrivateStorageModule } from './private-storage/private-storage.module';

@Module({
  imports: [AuthModule, PrismaModule, HttpConfigModule, PrivateStorageModule],
  exports: [AuthModule, PrismaModule, HttpConfigModule, PrivateStorageModule],
})
export class CoreModule {}
