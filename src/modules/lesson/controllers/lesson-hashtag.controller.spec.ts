import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { CreateHashtagDto } from '@src/modules/hashtag/dtos/create-many-hashtag.dto';
import { UpdateHashtagDto } from '@src/modules/hashtag/dtos/update-many-hashtag.dto';
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
    let createHashtagDto: CreateHashtagDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let createdHashtags;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      createHashtagDto = new CreateHashtagDto();
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
      expect(mockLessonHashtagService.createHashtag).toHaveBeenCalledTimes(1);
      expect(mockLessonHashtagService.createHashtag).toBeCalledWith(
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
    let updateHashtagDto: UpdateHashtagDto;
    let param: IdRequestParamDto;
    let memberId: number;
    let updatedHashtags;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      updateHashtagDto = new UpdateHashtagDto();
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
});
