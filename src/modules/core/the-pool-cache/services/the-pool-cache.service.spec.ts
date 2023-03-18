import { Test, TestingModule } from '@nestjs/testing';
import { ThePoolCacheService } from './the-pool-cache.service';

describe('ThePoolCacheService', () => {
  let service: ThePoolCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThePoolCacheService],
    }).compile();

    service = module.get<ThePoolCacheService>(ThePoolCacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
