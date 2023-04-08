import { CacheModule, Global, Module } from '@nestjs/common';
import { ThePoolCacheService } from './services/the-pool-cache.service';

@Global()
@Module({
  imports: [CacheModule.register()],
  providers: [ThePoolCacheService],
  exports: [CacheModule, ThePoolCacheService],
})
export class ThePoolCacheModule {}
