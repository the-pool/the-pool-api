import { Global, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { ThePoolConfigModule } from '@src/modules/core/the-pool-config/the-pool-config.module';
import { HttpConfigModule } from './http/http-config.module';
import { NotificationModule } from './notification/notification.module';
import { PrivateStorageModule } from './private-storage/private-storage.module';
import { ThePoolCacheModule } from './the-pool-cache/the-pool-cache.module';

@Global()
@Module({
  imports: [
    AuthModule,
    PrismaModule,
    HttpConfigModule,
    PrivateStorageModule,
    NotificationModule,
    ThePoolCacheModule,
    ThePoolConfigModule,
  ],
  exports: [
    AuthModule,
    PrismaModule,
    HttpConfigModule,
    PrivateStorageModule,
    NotificationModule,
    ThePoolCacheModule,
    ThePoolConfigModule,
  ],
})
export class CoreModule {}
