import { Module } from '@nestjs/common';
import { AuthModule } from '@src/modules/core/auth/auth.module';
import { PrismaModule } from '@src/modules/core/database/prisma/prisma.module';
import { ElasticModule } from '@src/modules/core/elastic/elastic.module';
import { HttpConfigModule } from './http/http-config.module';
import { PrivateStorageModule } from './private-storage/private-storage.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    HttpConfigModule,
    PrivateStorageModule,
    ElasticModule,
  ],
  exports: [
    AuthModule,
    PrismaModule,
    HttpConfigModule,
    PrivateStorageModule,
    ElasticModule,
  ],
})
export class CoreModule {}
