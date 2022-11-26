import { Test, TestingModule } from '@nestjs/testing';
import { MajorService } from './major.service';

describe('MajorService', () => {
  let service: MajorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MajorService],
    }).compile();

    service = module.get<MajorService>(MajorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
