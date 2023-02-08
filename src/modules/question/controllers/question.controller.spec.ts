import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockQuestionService } from '../../../../test/mock/mock-services';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionService } from '../services/question.service';
import { QuestionController } from './question.controller';

describe('QuestionController', () => {
  let questionController: QuestionController;
  let questionService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: PrismaService,
          useValue: mockPrismaService
        },
        {
          provide: QuestionService,
          useValue: mockQuestionService
        }
      ]
    }).compile();

    questionController = module.get<QuestionController>(QuestionController);
    questionService = mockQuestionService;
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  })

  it('should be defined', () => {
    expect(questionController).toBeDefined();
  });

  describe('get Question Category List', () => {
    let categoryList: QuestionCategoryEntity[];

    beforeEach(() => {
      categoryList = [new QuestionCategoryEntity()];
      questionService.findQuestionCategoryList.mockResolvedValueOnce(categoryList);
    })

    it('SUCCESS - get question category list', async () => {
      const result: QuestionCategoryEntity[] = await questionController.findQuestionCategoryList();

      expect(questionService.findQuestionCategoryList).toBeCalledTimes(1);
      expect(result).toStrictEqual(categoryList);
    })
  })
});
