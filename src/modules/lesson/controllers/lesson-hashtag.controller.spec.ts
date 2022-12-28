import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { prisma } from '@prisma/client';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { CreateManyHashtagDto } from '@src/modules/hashtag/dtos/create-many-hashtag.dto';
import { LessonHashtagParamDto } from '@src/modules/hashtag/dtos/hashtag-param.dto';
import { UpdateHashtagDto } from '@src/modules/hashtag/dtos/update-hashtag.dto';
import { UpdateManyHashtagDto } from '@src/modules/hashtag/dtos/update-many-hashtag.dto';
import { HashtagEntity } from '@src/modules/hashtag/entities/hashtag.entity';
import { mockPrismaHelper } from '../../../../test/mock/mock-helper';
import { mockLessonHashtagService } from '../../../../test/mock/mock-services';
import { LessonHashtagService } from '../services/lesson-hashtag.service';
import { LessonHashtagController } from './lesson-hashtag.controller';

describe('LessonHashtagController', () => {
  let lessonHashtagController: LessonHashtagController;
  let lessonHashtagService;
  let prismaHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonHashtagController],
      providers: [
        {
          provide: LessonHashtagService,
          useValue: mockLessonHashtagService,
        },
        {
          provide: PrismaHelper,
          useValue: mockPrismaHelper,
        },
      ],
    }).compile();

    lessonHashtagController = module.get<LessonHashtagController>(
      LessonHashtagController,
    );
    lessonHashtagService = mockLessonHashtagService;
    prismaHelper = mockPrismaHelper;
  });

  afterEach(async () => {
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

    beforeEach(async () => {
      memberId = faker.datatype.number();
      createHashtagDto = new CreateManyHashtagDto();
      param = {
        id: faker.datatype.number(),
        model: ModelName.Lesson,
      };
      createdHashtags = [{ name: faker.datatype.string }];

      lessonHashtagService.createHashtag.mockReturnValue(createdHashtags);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.createHashtag(
        param,
        createHashtagDto,
        memberId,
      );
      expect(prismaHelper.findOneOrFail).toBeCalledTimes(1);
      expect(lessonHashtagService.createHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.createHashtag).toBeCalledWith(
        createHashtagDto.hashtags,
        param.id,
      );
    });

    it('success - check routing', async () => {
      const returnValue = await lessonHashtagController.createHashtag(
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

    beforeEach(async () => {
      memberId = faker.datatype.number();
      updateHashtagDto = new UpdateManyHashtagDto();
      param = {
        id: faker.datatype.number(),
        model: ModelName.Lesson,
      };
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

      expect(prismaHelper.findOneOrFail).toBeCalledTimes(1);
      expect(mockLessonHashtagService.updateManyHashtag).toHaveBeenCalledTimes(
        1,
      );
      expect(mockLessonHashtagService.updateManyHashtag).toBeCalledWith(
        updateHashtagDto.hashtags,
        param.id,
      );
    });

    it('success - check routing', async () => {
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

    beforeEach(async () => {
      memberId = faker.datatype.number();
      updateHashtagDto = new UpdateHashtagDto();
      param = {
        id: faker.datatype.number(),
        model: ModelName.Lesson,
        hashtagId: faker.datatype.number(),
      };
      updatedHashtag = new HashtagEntity();

      lessonHashtagService.updateHashtag.mockReturnValue(updatedHashtag);
    });

    it('success - check method called', async () => {
      await lessonHashtagController.updateHashtag(
        param,
        updateHashtagDto,
        memberId,
      );

      expect(prismaHelper.findOneOrFail).toBeCalledTimes(2);
      expect(lessonHashtagService.updateHashtag).toBeCalledTimes(1);
      expect(lessonHashtagService.updateHashtag).toBeCalledWith(
        param.hashtagId,
        updateHashtagDto.hashtag,
      );
    });

    it('success - check routing', async () => {
      const reuturnValue = await lessonHashtagController.updateHashtag(
        param,
        updateHashtagDto,
        memberId,
      );

      expect(reuturnValue).toStrictEqual(updatedHashtag);
    });
  });
});