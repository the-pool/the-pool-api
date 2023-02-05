import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateManyLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/create-many-lesson-hashtag.dto';
import { LessonHashtagParamDto } from '@src/modules/lesson/dtos/hashtag/lesson-hashtag-param.dto';
import { UpdateManyLessonHashtagDto } from '@src/modules/lesson/dtos/hashtag/update-many-lesson-hashtag.dto';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonHashtagService } from '../../../../test/mock/mock-services';
import { LessonHashtagService } from '../services/lesson-hashtag.service';
import { LessonHashtagController } from './lesson-hashtag.controller';
import { ReadLessonHashtagDto } from '../dtos/hashtag/read-many-lesson-hashtag.dto';
import { ModelName } from '@src/constants/enum';

describe('LessonHashtagController', () => {
  let lessonHashtagController: LessonHashtagController;
  let lessonHashtagService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonHashtagController],
      providers: [
        {
          provide: LessonHashtagService,
          useValue: mockLessonHashtagService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonHashtagController = module.get<LessonHashtagController>(
      LessonHashtagController,
    );
    lessonHashtagService = mockLessonHashtagService;
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonHashtagController).toBeDefined();
  });

  describe('createManyHashtag', () => {
    let createManyHashtagDto: CreateManyLessonHashtagDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let lessonHashtags: ReadLessonHashtagDto[];

    beforeEach(() => {
      memberId = faker.datatype.number();
      createManyHashtagDto = new CreateManyLessonHashtagDto();
      param = new IdRequestParamDto();
      lessonHashtags = [new ReadLessonHashtagDto()];

      lessonHashtagService.createManyHashtag.mockReturnValue(lessonHashtags);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.createManyHashtag(
        param,
        createManyHashtagDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonHashtagService.createManyHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.createManyHashtag).toBeCalledWith(
        createManyHashtagDto.lessonHashtagIds,
        param.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.createManyHashtag(
        param,
        createManyHashtagDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonHashtags });
    });
  });

  describe('updateManyHashtag', () => {
    let updateManyLessonHashtagDto: UpdateManyLessonHashtagDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let lessonHashtags: ReadLessonHashtagDto[];

    beforeEach(() => {
      memberId = faker.datatype.number();
      updateManyLessonHashtagDto = new UpdateManyLessonHashtagDto();
      param = new IdRequestParamDto();
      lessonHashtags = [new ReadLessonHashtagDto()];

      lessonHashtagService.updateManyHashtag.mockReturnValue(lessonHashtags);
    });

    afterEach(() => {
      lessonHashtagService.updateManyHashtag.mockRestore();
    });

    it('success - check method called', async () => {
      await lessonHashtagController.updateManyHashtag(
        param,
        updateManyLessonHashtagDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonHashtagService.updateManyHashtag).toHaveBeenCalledTimes(1);
      expect(lessonHashtagService.updateManyHashtag).toBeCalledWith(
        updateManyLessonHashtagDto.lessonHashtagIds,
        param.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.updateManyHashtag(
        param,
        updateManyLessonHashtagDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lessonHashtags });
    });
  });

  describe('deleteManyHashtag', () => {
    let param: LessonHashtagParamDto;
    let memberId: number;
    let deletedHashtagCount: { count: number };

    beforeEach(() => {
      memberId = faker.datatype.number();
      param = {
        id: faker.datatype.number(),
        model: ModelName.Lesson,
        lessonHashtagIds: [faker.datatype.number()],
      };
      deletedHashtagCount = { count: faker.datatype.number() };
      lessonHashtagService.deleteManyHashtagByHashtagId.mockReturnValue(
        deletedHashtagCount,
      );
    });

    it('success - check method called', async () => {
      await lessonHashtagController.deleteManyHashtag(param, memberId);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(prismaService.validateMappedData).toBeCalledTimes(1);
      expect(lessonHashtagService.deleteManyHashtagByHashtagId).toBeCalledTimes(
        1,
      );
      expect(lessonHashtagService.deleteManyHashtagByHashtagId).toBeCalledWith(
        param.id,
        param.lessonHashtagIds,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.deleteManyHashtag(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual(deletedHashtagCount);
    });
  });

  describe('readManyHashtag', () => {
    let param: IdRequestParamDto;
    let lessonHashtags: ReadLessonHashtagDto[];

    beforeEach(() => {
      param = new IdRequestParamDto();
      lessonHashtags = [new ReadLessonHashtagDto()];

      lessonHashtagService.readManyHashtag.mockReturnValue(lessonHashtags);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.readManyHashtag(param);

      expect(lessonHashtagService.readManyHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.readManyHashtag).toBeCalledWith(param.id);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.readManyHashtag(param);

      expect(returnValue).toStrictEqual({ lessonHashtags });
    });
  });
});
