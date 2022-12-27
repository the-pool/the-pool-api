import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockDataStructureHelper } from '../../../../test/mock/mock-helper';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonHashtagService } from './lesson-hashtag.service';

describe('LessonHashtagService', () => {
  let lessonHashtagService: LessonHashtagService;
  let prismaService;
  let dataStructureHelper;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonHashtagService,
        DataStructureHelper,
        {
          provide: DataStructureHelper,
          useValue: mockDataStructureHelper,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonHashtagService =
      module.get<LessonHashtagService>(LessonHashtagService);
    dataStructureHelper = mockDataStructureHelper;
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(lessonHashtagService).toBeDefined();
  });

  describe('createHashtag', () => {
    let hashtags: string[];
    let lessonId: number;
    let memberId: number;
    let fakeString: string;
    let createdLessonHashtags;

    beforeEach(async () => {
      fakeString = faker.datatype.string();
      hashtags = [fakeString];
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      createdLessonHashtags = [{ tag: fakeString }];

      prismaService.lessonHashtag.findMany.mockReturnValue(
        createdLessonHashtags,
      );
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success - check method called', async () => {
      await lessonHashtagService.createHashtag(hashtags, lessonId);

      expect(prismaService.lessonHashtag.createMany).toBeCalledTimes(1);
      expect(prismaService.lessonHashtag.findMany).toBeCalledTimes(1);
      expect(dataStructureHelper.createManyMapper).toBeCalledTimes(1);
    });

    it('success - Input & Output', async () => {
      const returnValue = await lessonHashtagService.createHashtag(
        hashtags,
        lessonId,
      );

      expect(returnValue).toStrictEqual([{ name: fakeString }]);
    });
  });
});
