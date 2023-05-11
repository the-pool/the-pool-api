import { Test, TestingModule } from '@nestjs/testing';
import { SearchController } from '@src/modules/search/controllers/search.controller';
import { SearchService } from '@src/modules/search/serviecs/search.service';

describe('SearchController', () => {
  let controller: SearchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SearchController],
      providers: [
        {
          provide: SearchService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<SearchController>(SearchController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
