import { Global, Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { HttpConfigModule } from '@src/modules/core/http/http-config.module';
import { NotificationModule } from '@src/modules/core/notification/notification.module';
import { PrivateStorageModule } from '@src/modules/core/private-storage/private-storage.module';
import { ThePoolCacheModule } from '@src/modules/core/the-pool-cache/the-pool-cache.module';
import { ThePoolConfigModule } from '@src/modules/core/the-pool-config/the-pool-config.module';

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
