import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { ModelName } from '@src/constants/enum';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { CreateHashtagDto } from '@src/modules/hashtag/dtos/create-hashtag.dto';
import { mockLessonHashtagService } from '../../../../test/mock/mock-services';
import { LessonHashtagService } from '../services/lesson-hashtag.service';
import { LessonHashtagController } from './lesson-hashtag.controller';

describe('LessonHashtagController', () => {
  let lessonHashtagController: LessonHashtagController;
  let lessonHashtagService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonHashtagController],
      providers: [
        {
          provide: LessonHashtagService,
          useValue: mockLessonHashtagService,
        },
      ],
    }).compile();

    lessonHashtagController = module.get<LessonHashtagController>(
      LessonHashtagController,
    );
    lessonHashtagService = mockLessonHashtagService;
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

      mockLessonHashtagService.createHashtag.mockReturnValue(createdHashtags);
    });
    afterEach(() => {
      lessonHashtagService.createHashtag.mockRestore();
    });

    it('success - routing', async () => {
      const returnValue = await lessonHashtagController.createHashtag(
        param,
        createHashtagDto,
        memberId,
      );

      expect(mockLessonHashtagService.createHashtag).toHaveBeenCalledTimes(1);
      expect(mockLessonHashtagService.createHashtag).toBeCalledWith(
        createHashtagDto.hashtags,
        param.id,
        memberId,
      );

      expect(returnValue.hashtags).toStrictEqual(createdHashtags);
    });
  });
});
