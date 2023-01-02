import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonEvaluationService } from './lesson-evaluation.service';

describe('LessonEvaluationService', () => {
  let lessonEvaluationService: LessonEvaluationService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonEvaluationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonEvaluationService = module.get<LessonEvaluationService>(
      LessonEvaluationService,
    );
    prismaService = mockPrismaService;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('createEvaluation', () => {
    let lessonId: number;
    let memberId: number;
    let levelId: number;
    let createdEvaluation: LessonEvaluationEntity;

    beforeEach(async () => {
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      levelId = faker.datatype.number();
      createdEvaluation = new LessonEvaluationEntity();

      prismaService.lessonLevelEvaluation.create.mockReturnValue(
        createdEvaluation,
      );
    });

    it('success - check method called', () => {
      lessonEvaluationService.createEvaluation(lessonId, memberId, levelId);

      expect(prismaService.lessonLevelEvaluation.create).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonEvaluationService.createEvaluation(
        lessonId,
        memberId,
        levelId,
      );

      expect(returnValue).toStrictEqual(createdEvaluation);
    });
  });
});
