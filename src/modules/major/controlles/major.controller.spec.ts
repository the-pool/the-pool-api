import { Test, TestingModule } from '@nestjs/testing';
import { MajorController } from './major.controller';
import { MajorService } from '../services/major.service';

describe('MajorController', () => {
  let controller: MajorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MajorController],
      providers: [MajorService],
    }).compile();

    controller = module.get<MajorController>(MajorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
