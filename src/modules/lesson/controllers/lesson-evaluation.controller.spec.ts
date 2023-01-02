import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { mockPrismaHelper } from '../../../../test/mock/mock-helper';
import { mockLessonEvaluationService } from '../../../../test/mock/mock-services';
import { CreateEvaluationDto } from '../dtos/create-evaluation.dto';
import { UpdateEvaluationDto } from '../dtos/update-evaluation.dto';
import { LessonEvaluationEntity } from '../entities/lesson-evaluation.entity';
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
});
