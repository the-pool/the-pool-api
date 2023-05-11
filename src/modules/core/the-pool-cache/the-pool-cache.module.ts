import { CacheModule, Global, Module } from '@nestjs/common';
import { ThePoolCacheService } from '@src/modules/core/the-pool-cache/services/the-pool-cache.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [ThePoolCacheService],
  exports: [CacheModule, ThePoolCacheService],
})
export class ThePoolCacheModule {}
