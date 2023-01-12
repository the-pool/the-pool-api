import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonEvaluationService } from '../../../../test/mock/mock-services';
import { CreateEvaluationDto } from '../dtos/evaluation/create-evaluation.dto';
import { LessonEvaluationQueryDto } from '../dtos/evaluation/lesson-evaluation-query.dto';
import { UpdateEvaluationDto } from '../dtos/evaluation/update-evaluation.dto';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonLevelEvaluationEntity } from '../entities/lesson-level-evaluation.entity';
import { LessonEvaluationService } from '../services/lesson-evaluation.service';
import { LessonEvaluationController } from './lesson-evaluation.controller';

describe('LessonEvaluationController', () => {
  let lessonEvaluationController: LessonEvaluationController;
  let lessonEvaluationService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonEvaluationController],
      providers: [
        {
          provide: LessonEvaluationService,
          useValue: mockLessonEvaluationService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonEvaluationController = module.get<LessonEvaluationController>(
      LessonEvaluationController,
    );
    lessonEvaluationService = mockLessonEvaluationService;
    prismaService = mockPrismaService;
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonEvaluationController).toBeDefined();
  });

  describe('createEvaluation', () => {
    let createEvaluationDto: CreateEvaluationDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let createdEvaluation;

    beforeEach(async () => {
      createEvaluationDto = new CreateEvaluationDto();
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      createdEvaluation = new LessonEvaluationEntity();

      lessonEvaluationService.createEvaluation.mockReturnValue(
        createdEvaluation,
      );
    });

    it('success - check method called', async () => {
      await lessonEvaluationController.createEvaluation(
        param,
        createEvaluationDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaService.validateDuplicateAndFail).toBeCalledTimes(1);
      expect(lessonEvaluationService.createEvaluation).toBeCalledWith(
        param.id,
        memberId,
        createEvaluationDto.levelId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonEvaluationController.createEvaluation(
        param,
        createEvaluationDto,
        memberId,
      );

      expect(returnValue.evaluation).toStrictEqual(createdEvaluation);
    });
  });

  describe('updateEvaluation', () => {
    let param: IdRequestParamDto;
    let updateEvaluationDto: UpdateEvaluationDto;
    let memberId: number;
    let updatedEvaluation: LessonEvaluationEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      updateEvaluationDto = new UpdateEvaluationDto();
      memberId = faker.datatype.number();
      updatedEvaluation = new LessonEvaluationEntity();

      lessonEvaluationService.updateEvaluation.mockReturnValue(
        updatedEvaluation,
      );
    });

    it('success - check method called', async () => {
      await lessonEvaluationController.updateEvaluation(
        param,
        updateEvaluationDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonEvaluationService.updateEvaluation).toBeCalledWith(
        param.id,
        updateEvaluationDto.levelId,
        memberId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonEvaluationController.updateEvaluation(
        param,
        updateEvaluationDto,
        memberId,
      );

      expect(returnValue.evaluation).toStrictEqual(updatedEvaluation);
    });
  });

  describe('readCountedEvaluation', () => {
    let param: IdRequestParamDto;
    let member: MemberEntity | { id: null };
    let countedEvaluation: LessonLevelEvaluationEntity[];
    let memberEvaluate: LessonEvaluationEntity | null;

    beforeEach(() => {
      param = new IdRequestParamDto();
      member = new MemberEntity();
      countedEvaluation = [new LessonLevelEvaluationEntity()];
      memberEvaluate = new LessonEvaluationEntity();

      lessonEvaluationService.readCountedEvaluation.mockReturnValue(
        countedEvaluation,
      );
      lessonEvaluationService.readMemberEvaluation.mockReturnValue(
        memberEvaluate,
      );
    });

    it('success - check method called', async () => {
      await lessonEvaluationController.readCountedEvaluation(param, member);

      expect(lessonEvaluationService.readCountedEvaluation).toBeCalledTimes(1);
      expect(lessonEvaluationService.readCountedEvaluation).toBeCalledWith(
        param.id,
      );
      expect(lessonEvaluationService.readMemberEvaluation).toBeCalledTimes(1);
      expect(lessonEvaluationService.readMemberEvaluation).toBeCalledWith(
        param.id,
        member.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue =
        await lessonEvaluationController.readCountedEvaluation(param, member);

      expect(returnValue).toStrictEqual({ countedEvaluation, memberEvaluate });
    });
  });

  describe('readManyEvaluation', () => {
    let param: IdRequestParamDto;
    let query: LessonEvaluationQueryDto;
    let evaluations: LessonEvaluationEntity[];

    beforeEach(() => {
      param = new IdRequestParamDto();
      query = new LessonEvaluationQueryDto();
      evaluations = [new LessonEvaluationEntity()];
      lessonEvaluationService.readManyEvaluation.mockReturnValue(evaluations);
    });

    it('success - check method called', async () => {
      await lessonEvaluationController.readManyEvaluation(param, query);

      expect(lessonEvaluationService.readManyEvaluation).toBeCalledTimes(1);
      expect(lessonEvaluationService.readManyEvaluation).toBeCalledWith(
        param.id,
        query,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonEvaluationController.readManyEvaluation(
        param,
        query,
      );

      expect(returnValue).toStrictEqual({ evaluations });
    });
  });
});
