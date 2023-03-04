import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonLikeService } from '../../../../test/mock/mock-services';
import { LessonLikeEntity } from '../entities/lesson-like.entity';
import { LessonLikeService } from '../services/lesson-like.service';
import { LessonLikeController } from './lesson-like.controller';

describe('LessonLikeController', () => {
  let lessonLikeController: LessonLikeController;
  let lessonLikeService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonLikeController],
      providers: [
        {
          provide: LessonLikeService,
          useValue: mockLessonLikeService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonLikeController =
      module.get<LessonLikeController>(LessonLikeController);
    lessonLikeService = mockLessonLikeService;
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defind', () => {
    expect(lessonLikeController).toBeDefined();
  });

  describe('createLike', () => {
    let param: IdRequestParamDto;
    let memberId: number;
    let lessonLike: LessonLikeEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      lessonLike = new LessonLikeEntity();

      lessonLikeService.createLike.mockReturnValue(lessonLike);
    });

    it('success - check method called', async () => {
      await lessonLikeController.createLike(param, memberId);

      expect(prismaService.validateMappedDataOrFail).toBeCalledTimes(1);
      expect(prismaService.validateMappedDataOrFail).toBeCalledWith(
        ModelName.LessonLike,
        { memberId, lessonId: { in: [param.id] } },
        false,
      );
      expect(lessonLikeService.createLike).toBeCalledTimes(1);
      expect(lessonLikeService.createLike).toBeCalledWith(param.id, memberId);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonLikeController.createLike(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonLike });
    });
  });

  describe('deleteLike', () => {
    let param: IdRequestParamDto;
    let memberId: number;
    let lessonLike: LessonLikeEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      lessonLike = new LessonLikeEntity();

      lessonLikeService.deleteLike.mockReturnValue(lessonLike);
    });

    it('success - check method called', async () => {
      await lessonLikeController.deleteLike(param, memberId);

      expect(prismaService.validateMappedDataOrFail).toBeCalledTimes(1);
      expect(prismaService.validateMappedDataOrFail).toBeCalledWith(
        ModelName.LessonLike,
        {
          memberId,
          lessonId: { in: [param.id] },
        },
        true,
      );
      expect(lessonLikeService.deleteLike).toBeCalledTimes(1);
      expect(lessonLikeService.deleteLike).toBeCalledWith(param.id, memberId);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonLikeController.deleteLike(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonLike });
    });
  });
});
