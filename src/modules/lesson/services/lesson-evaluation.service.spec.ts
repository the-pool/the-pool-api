import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { LessonLevelId } from '@src/constants/enum';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonEvaluationQueryDto } from '../dtos/evaluation/lesson-evaluation-query.dto';
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

  describe('updateEvaluation', () => {
    let lessonId: number;
    let levelId: number | null;
    let memberId: number;
    let createdEvaluation: LessonEvaluationEntity;
    let spyCreateEvaluation: jest.SpyInstance;

    beforeEach(async () => {
      lessonId = faker.datatype.number();
      levelId = faker.datatype.number();
      memberId = faker.datatype.number();
      createdEvaluation = new LessonEvaluationEntity();

      prismaService.lessonLevelEvaluation.create.mockReturnValue(
        createdEvaluation,
      );
      spyCreateEvaluation = jest.spyOn(
        lessonEvaluationService,
        'createEvaluation',
      );
    });

    describe('levelId !== null', () => {
      it('success - check method called', async () => {
        await lessonEvaluationService.updateEvaluation(
          lessonId,
          levelId,
          memberId,
        );

        expect(prismaService.lessonLevelEvaluation.deleteMany).toBeCalledTimes(
          1,
        );
        expect(lessonEvaluationService.createEvaluation).toBeCalledTimes(1);
      });

      it('success - check Input & Output', async () => {
        const returnValue = await lessonEvaluationService.updateEvaluation(
          lessonId,
          levelId,
          memberId,
        );

        expect(returnValue).toStrictEqual(createdEvaluation);
      });
    });

    describe('levelId === null', () => {
      it('success - check method called', async () => {
        levelId = null;

        await lessonEvaluationService.updateEvaluation(
          lessonId,
          levelId,
          memberId,
        );

        expect(prismaService.lessonLevelEvaluation.deleteMany).toBeCalledTimes(
          1,
        );
        expect(lessonEvaluationService.createEvaluation).toBeCalledTimes(0);
      });

      it('success - check Input & Output', async () => {
        const returnValue = await lessonEvaluationService.updateEvaluation(
          lessonId,
          levelId,
          memberId,
        );

        expect(returnValue).toEqual({});
      });
    });
  });

  describe('readCountedEvaluation', () => {
    let lessonId: number;
    let countedEvaluation;

    beforeEach(async () => {
      lessonId = faker.datatype.number();
      countedEvaluation = [
        {
          _count: { lessonId: faker.datatype.number() },
          levelId: LessonLevelId.Top,
        },
      ];

      prismaService.lessonLevelEvaluation.groupBy.mockReturnValue(
        countedEvaluation,
      );
    });

    it('success - check method called', async () => {
      await lessonEvaluationService.readCountedEvaluation(lessonId);

      expect(prismaService.lessonLevelEvaluation.groupBy).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonEvaluationService.readCountedEvaluation(
        lessonId,
      );

      expect(returnValue).toHaveProperty('top');
    });
  });

  describe('readMemberEvaluation', () => {
    let lessonId: number;
    let memberId: number | null;
    let memberEvaluation: LessonEvaluationEntity | null;

    beforeEach(async () => {
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      memberEvaluation = new LessonEvaluationEntity();

      prismaService.lessonLevelEvaluation.findFirst.mockReturnValue(
        memberEvaluation,
      );
    });

    describe('memberId !== null', () => {
      it('success - check method called', () => {
        lessonEvaluationService.readMemberEvaluation(lessonId, memberId);

        expect(prismaService.lessonLevelEvaluation.findFirst).toBeCalledTimes(
          1,
        );
      });
      it('success - check Input & Output', () => {
        const returnValue = lessonEvaluationService.readMemberEvaluation(
          lessonId,
          memberId,
        );

        expect(returnValue).toStrictEqual(memberEvaluation);
      });
    });

    describe('memberId === null', () => {
      beforeEach(() => {
        memberId = null;
      });
      it('success - check method called', () => {
        lessonEvaluationService.readMemberEvaluation(lessonId, memberId);

        expect(prismaService.lessonLevelEvaluation.findFirst).toBeCalledTimes(
          0,
        );
      });
      it('success - check Input & Output', () => {
        const returnValue = lessonEvaluationService.readMemberEvaluation(
          lessonId,
          memberId,
        );

        expect(returnValue).toBeNull();
      });
    });
  });

  describe('readMenyEvaluation', () => {
    let lessonId: number;
    let query: LessonEvaluationQueryDto;
    let evaluations: LessonEvaluationEntity[];

    beforeEach(() => {
      lessonId = faker.datatype.number();
      query = new LessonEvaluationQueryDto();
      evaluations = [new LessonEvaluationEntity()];

      prismaService.lessonLevelEvaluation.findMany.mockReturnValue(evaluations);
    });

    it('success - check method called', () => {
      lessonEvaluationService.readManyEvaluation(lessonId, query);

      expect(prismaService.lessonLevelEvaluation.findMany).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonEvaluationService.readManyEvaluation(
        lessonId,
        query,
      );

      expect(returnValue).toStrictEqual(evaluations);
    });
  });
});
