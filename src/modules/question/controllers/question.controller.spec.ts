import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from '@src/modules/question/controllers/question.controller';
import { QuestionCategoryEntity } from '@src/modules/question/entities/question-category.entity';
import { QuestionService } from '@src/modules/question/services/question.service';
import { mockQuestionService } from '@test/mock/mock-services';

describe('QuestionController', () => {
  let questionController: QuestionController;
  let questionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService,
        },
      ],
    }).compile();

    questionController = module.get<QuestionController>(QuestionController);
    questionService = mockQuestionService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(questionController).toBeDefined();
  });

  describe('get Question Category List', () => {
    let categoryList: QuestionCategoryEntity[];

    beforeEach(() => {
      categoryList = [new QuestionCategoryEntity()];
      questionService.findQuestionCategoryList.mockResolvedValueOnce(
        categoryList,
      );
    });

    it('SUCCESS - get question category list', async () => {
      const result: QuestionCategoryEntity[] =
        await questionController.findQuestionCategoryList();

      expect(questionService.findQuestionCategoryList).toBeCalledTimes(1);
      expect(result).toStrictEqual(categoryList);
    });
  });
});
