import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionService } from './question.service';

describe('QuestionService', () => {
  let service: QuestionService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Get - Question Category List
  describe('Get Question Category List', () => {
    let categoryList: QuestionCategoryEntity[];

    beforeEach(() => {
      categoryList = [new QuestionCategoryEntity()];
      prismaService.questionCategory.findMany.mockResolvedValueOnce(
        categoryList,
      );
    });

    it('SUCCESS - get question category list', async () => {
      const result: QuestionCategoryEntity[] =
        await service.findQuestionCategoryList();

      expect(prismaService.questionCategory.findMany).toBeCalledTimes(1);
      expect(result).toStrictEqual(categoryList);
    });
  });
});
