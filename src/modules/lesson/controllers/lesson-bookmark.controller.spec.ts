import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonBookmarkController } from '@src/modules/lesson/controllers/lesson-bookmark.controller';
import { LessonBookmarkEntity } from '@src/modules/lesson/entities/lesson-bookmark.entity';
import { LessonBookmarkService } from '@src/modules/lesson/services/lesson-bookmark.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockLessonBookmarkService } from '@test/mock/mock-services';

describe('LessonBookmarkController', () => {
  let lessonBookmarkController: LessonBookmarkController;
  let lessonBookmarkService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonBookmarkController],
      providers: [
        {
          provide: LessonBookmarkService,
          useValue: mockLessonBookmarkService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonBookmarkController = module.get<LessonBookmarkController>(
      LessonBookmarkController,
    );
    lessonBookmarkService = mockLessonBookmarkService;
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonBookmarkController).toBeDefined();
  });

  describe('createBookmark', () => {
    let param: IdRequestParamDto;
    let memberId: number;
    let lessonBookmark: LessonBookmarkEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      lessonBookmark = new LessonBookmarkEntity();

      lessonBookmarkService.createBookmark.mockReturnValue(lessonBookmark);
    });

    it('success - check method called', async () => {
      await lessonBookmarkController.createBookmark(param, memberId);

      expect(prismaService.validateMappedDataOrFail).toBeCalledTimes(1);
      expect(prismaService.validateMappedDataOrFail).toBeCalledWith(
        ModelName.LessonBookmark,
        {
          memberId,
          lessonId: { in: [param.id] },
        },
        false,
      );
      expect(lessonBookmarkService.createBookmark).toBeCalledTimes(1);
      expect(lessonBookmarkService.createBookmark).toBeCalledWith(
        param.id,
        memberId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonBookmarkController.createBookmark(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonBookmark });
    });
  });

  describe('deleteBookmark', () => {
    let param: IdRequestParamDto;
    let memberId: number;
    let lessonBookmark: LessonBookmarkEntity;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      lessonBookmark = new LessonBookmarkEntity();

      lessonBookmarkService.deleteBookmark.mockReturnValue(lessonBookmark);
    });

    it('success - check method called', async () => {
      await lessonBookmarkController.deleteBookmark(param, memberId);

      expect(prismaService.validateMappedDataOrFail).toBeCalledTimes(1);
      expect(prismaService.validateMappedDataOrFail).toBeCalledWith(
        ModelName.LessonBookmark,
        {
          memberId,
          lessonId: { in: [param.id] },
        },
        true,
      );
      expect(lessonBookmarkService.deleteBookmark).toBeCalledTimes(1);
      expect(lessonBookmarkService.deleteBookmark).toBeCalledWith(
        param.id,
        memberId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonBookmarkController.deleteBookmark(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonBookmark });
    });
  });
});
