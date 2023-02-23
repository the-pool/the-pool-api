import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MockClassType } from 'test/mock/mock.type';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockQuestionService } from '../../../../test/mock/mock-services';
import { CreateQuestionRequestBodyDto } from '../dtos/create-question-request-body.dto';
import { QuestionCategoryEntity } from '../entities/question-category.entity';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionService } from '../services/question.service';
import { QuestionController } from './question.controller';

describe('QuestionController', () => {
  let questionController: QuestionController;
  let questionService: MockClassType<QuestionService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [
        {
          provide: QuestionService,
          useValue: mockQuestionService
        }
      ]
    }).compile();

    questionController = module.get<QuestionController>(QuestionController);

    questionService = mockQuestionService;
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

  describe('Create Question', () => {
    let createQuestionRequestBodyDto: CreateQuestionRequestBodyDto;
    let memberId: number
    let createdQuestion: QuestionEntity

    beforeEach(() => {
      memberId = faker.datatype.number();
      createQuestionRequestBodyDto = {
        categoryId: 1,
        title: 'test Title',
        content: 'test Content'
      };
      createdQuestion = new QuestionEntity();
      questionService.createQuestion.mockReturnValue(createdQuestion);
    })

    it('SUCCESS - 질문 생성', async () => {
      const result = await questionService.createQuestion(
        createQuestionRequestBodyDto,
        memberId
      );

      expect(questionService.createQuestion).toBeCalledTimes(1);
      expect(result).toStrictEqual(createdQuestion);
    })
  })
});
