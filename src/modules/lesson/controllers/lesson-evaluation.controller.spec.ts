import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { Member } from '@prisma/client';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { MemberEntity } from '@src/modules/member/entities/member.entity';
import { mockPrismaHelper } from '../../../../test/mock/mock-helper';
import { mockLessonEvaluationService } from '../../../../test/mock/mock-services';
import { CreateEvaluationDto } from '../dtos/evaluation/create-evaluation.dto';
import { UpdateEvaluationDto } from '../dtos/lesson/update-evaluation.dto';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
import { LessonLevelEvaluationEntity } from '../entities/lesson-level-evaluation.entity';
import { LessonEvaluationService } from '../services/lesson-evaluation.service';
import { LessonEvaluationController } from './lesson-evaluation.controller';

describe('LessonEvaluationController', () => {
  let lessonEvaluationController: LessonEvaluationController;
  let lessonEvaluationService;
  let prismaHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonEvaluationController],
      providers: [
        {
          provide: LessonEvaluationService,
          useValue: mockLessonEvaluationService,
        },
        {
          provide: PrismaHelper,
          useValue: mockPrismaHelper,
        },
      ],
    }).compile();

    lessonEvaluationController = module.get<LessonEvaluationController>(
      LessonEvaluationController,
    );
    lessonEvaluationService = mockLessonEvaluationService;
    prismaHelper = mockPrismaHelper;
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

      expect(prismaHelper.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaHelper.validateDuplicateAndFail).toBeCalledTimes(1);
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

    beforeEach(async () => {
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

      expect(prismaHelper.validateOwnerOrFail).toBeCalledTimes(1);
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

  describe('readEvaluation', () => {
    let param: IdRequestParamDto;
    let member: MemberEntity | { id: null };
    let lessonEvaluations: LessonLevelEvaluationEntity[];
    let memberEvaluate: LessonEvaluationEntity | null;

    beforeEach(async () => {
      param = new IdRequestParamDto();
      member = new MemberEntity();
      lessonEvaluations = [new LessonLevelEvaluationEntity()];
      memberEvaluate = new LessonEvaluationEntity();

      lessonEvaluationService.readEvaluation.mockReturnValue(lessonEvaluations);
      lessonEvaluationService.readMemberEvaluation.mockReturnValue(
        memberEvaluate,
      );
    });

    it('success - check method called', async () => {
      await lessonEvaluationController.readEvaluation(param, member);

      expect(lessonEvaluationService.readEvaluation).toBeCalledTimes(1);
      expect(lessonEvaluationService.readEvaluation).toBeCalledWith(param.id);
      expect(lessonEvaluationService.readMemberEvaluation).toBeCalledTimes(1);
      expect(lessonEvaluationService.readMemberEvaluation).toBeCalledWith(
        param.id,
        member.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonEvaluationController.readEvaluation(
        param,
        member,
      );

      expect(returnValue).toStrictEqual({ lessonEvaluations, memberEvaluate });
    });
  });
});
