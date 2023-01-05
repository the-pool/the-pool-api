import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { CreateManyHashtagDto } from '@src/modules/hashtag/dtos/create-many-hashtag.dto';
import { LessonHashtagParamDto } from '@src/modules/hashtag/dtos/hashtag-param.dto';
import { UpdateHashtagDto } from '@src/modules/hashtag/dtos/update-hashtag.dto';
import { UpdateManyHashtagDto } from '@src/modules/hashtag/dtos/update-many-hashtag.dto';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonHashtagService } from '../../../../test/mock/mock-services';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
import { LessonHashtagService } from '../services/lesson-hashtag.service';
import { LessonHashtagController } from './lesson-hashtag.controller';

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

  describe('createHashtag', () => {
    let createHashtagDto: CreateManyHashtagDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let createdHashtags;

    beforeEach(() => {
      memberId = faker.datatype.number();
      createHashtagDto = new CreateManyHashtagDto();
      param = new IdRequestParamDto();
      createdHashtags = [{ name: faker.datatype.string }];

      lessonHashtagService.createHashtag.mockReturnValue(createdHashtags);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.createManyHashtag(
        param,
        createHashtagDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonHashtagService.createHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.createHashtag).toBeCalledWith(
        createHashtagDto.hashtags,
        param.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.createManyHashtag(
        param,
        createHashtagDto,
        memberId,
      );

      expect(returnValue.hashtags).toStrictEqual(createdHashtags);
    });
  });

  describe('updateManyHashtag', () => {
    let updateHashtagDto: UpdateManyHashtagDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let updatedHashtags;

    beforeEach(() => {
      memberId = faker.datatype.number();
      updateHashtagDto = new UpdateManyHashtagDto();
      param = new IdRequestParamDto();
      updatedHashtags = [{ name: faker.datatype.string }];

      lessonHashtagService.updateManyHashtag.mockReturnValue(updatedHashtags);
    });

    afterEach(() => {
      lessonHashtagService.updateManyHashtag.mockRestore();
    });

    it('success - check method called', async () => {
      await lessonHashtagController.updateManyHashtag(
        param,
        updateHashtagDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(mockLessonHashtagService.updateManyHashtag).toHaveBeenCalledTimes(
        1,
      );
      expect(mockLessonHashtagService.updateManyHashtag).toBeCalledWith(
        updateHashtagDto.hashtags,
        param.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.updateManyHashtag(
        param,
        updateHashtagDto,
        memberId,
      );

      expect(returnValue.hashtags).toStrictEqual(updatedHashtags);
    });
  });

  describe('updateHashtag', () => {
    let updateHashtagDto: UpdateHashtagDto;
    let param: LessonHashtagParamDto;
    let memberId: number;
    let updatedHashtag;

    beforeEach(() => {
      memberId = faker.datatype.number();
      updateHashtagDto = new UpdateHashtagDto();
      param = new LessonHashtagParamDto();
      updatedHashtag = new LessonHashtagEntity();

      lessonHashtagService.updateHashtag.mockReturnValue(updatedHashtag);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.updateOneHashtag(
        param,
        updateHashtagDto,
        memberId,
      );

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(2);
      expect(lessonHashtagService.updateHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.updateHashtag).toBeCalledWith(
        param.hashtagId,
        updateHashtagDto.hashtag,
      );
    });

    it('success - check Input & Output', async () => {
      const reuturnValue = await lessonHashtagController.updateOneHashtag(
        param,
        updateHashtagDto,
        memberId,
      );

      expect(reuturnValue).toStrictEqual({ hashtag: updatedHashtag });
    });
  });

  describe('deleteHashtag', () => {
    let param: LessonHashtagParamDto;
    let memberId: number;
    let deletedHashtag: LessonHashtagEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      param = new LessonHashtagParamDto();
      deletedHashtag = new LessonHashtagEntity();

      lessonHashtagService.deleteHashtag.mockReturnValue(deletedHashtag);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.deleteOneHashtag(param, memberId);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(2);
      expect(lessonHashtagService.deleteHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.deleteHashtag).toBeCalledWith(
        param.hashtagId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.deleteOneHashtag(
        param,
        memberId,
      );

      expect(returnValue).toStrictEqual({ hashtag: deletedHashtag });
    });
  });

  describe('readManyHashtag', () => {
    let param: IdRequestParamDto;
    let hashtags: LessonHashtagEntity[];

    beforeEach(() => {
      param = new IdRequestParamDto();
      hashtags = [new LessonHashtagEntity()];

      lessonHashtagService.readManyHashtag.mockReturnValue(hashtags);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.readManyHashtag(param);

      expect(lessonHashtagService.readManyHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.readManyHashtag).toBeCalledWith(param.id);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.readManyHashtag(param);

      expect(returnValue).toStrictEqual({ hashtags });
    });
  });

  describe('readHashtag', () => {
    let param: LessonHashtagParamDto;
    let hashtag: LessonHashtagEntity;

    beforeEach(() => {
      param = new LessonHashtagParamDto();
      hashtag = new LessonHashtagEntity();

      lessonHashtagService.readHashtag.mockReturnValue(hashtag);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.readOneHashtag(param);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonHashtagService.readHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.readHashtag).toBeCalledWith(param.hashtagId);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagController.readOneHashtag(param);

      expect(returnValue).toStrictEqual({ hashtag });
    });
  });
});
