import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockDataStructureHelper } from '../../../../test/mock/mock-helper';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonHashtagEntity } from '../entities/lesson-hashtag.entity';
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
    let fakeString: string;
    let fakeId: number;
    let createdLessonHashtags;

    beforeEach(() => {
      fakeString = faker.datatype.string();
      fakeId = faker.datatype.number();
      hashtags = [fakeString];
      lessonId = faker.datatype.number();
      createdLessonHashtags = [new LessonHashtagEntity()];

      prismaService.lessonHashtag.findMany.mockReturnValue(
        createdLessonHashtags,
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('success - check method called', async () => {
      await lessonHashtagService.createManyHashtag(hashtags, lessonId);

      expect(prismaService.lessonHashtag.createMany).toBeCalledTimes(1);
      expect(prismaService.lessonHashtag.findMany).toBeCalledTimes(1);
      expect(dataStructureHelper.createManyMapper).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagService.createManyHashtag(
        hashtags,
        lessonId,
      );

      expect(returnValue).toStrictEqual(createdLessonHashtags);
    });
  });

  describe('updateManyHashtag', () => {
    let hashtags: string[];
    let lessonId: number;
    let fakeId: number;
    let fakeString: string;
    let createdLessonHashtags;
    let spyDeleteManyHashtag: jest.SpyInstance;
    let spyCreateHashtag: jest.SpyInstance;

    beforeEach(() => {
      fakeId = faker.datatype.number();
      fakeString = faker.datatype.string();
      hashtags = [fakeString];
      lessonId = faker.datatype.number();
      createdLessonHashtags = [new LessonHashtagEntity()];

      prismaService.lessonHashtag.findMany.mockReturnValue(
        createdLessonHashtags,
      );
      spyDeleteManyHashtag = jest.spyOn(
        lessonHashtagService,
        'deleteManyHashtag',
      );
      spyCreateHashtag = jest.spyOn(lessonHashtagService, 'createManyHashtag');
    });

    it('success - check method called', async () => {
      await lessonHashtagService.updateManyHashtag(hashtags, lessonId);

      expect(spyDeleteManyHashtag).toBeCalledTimes(1);
      expect(spyCreateHashtag).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagService.updateManyHashtag(
        hashtags,
        lessonId,
      );

      expect(returnValue).toStrictEqual(createdLessonHashtags);
    });
  });

  describe('updateHashtag', () => {
    let hashtagId: number;
    let hashtag: string;
    let updatedHashtag: LessonHashtagEntity;

    beforeEach(() => {
      hashtagId = faker.datatype.number();
      hashtag = faker.datatype.string();
      updatedHashtag = new LessonHashtagEntity();

      prismaService.lessonHashtag.update.mockReturnValue(updatedHashtag);
    });

    it('success - check method called', async () => {
      await lessonHashtagService.updateOneHashtag(hashtagId, hashtag);

      expect(prismaService.lessonHashtag.update).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagService.updateOneHashtag(
        hashtagId,
        hashtag,
      );

      expect(returnValue).toStrictEqual(updatedHashtag);
    });
  });

  describe('deleteHashtag', () => {
    let hashtagId: number;
    let deletedHashtag: LessonHashtagEntity;

    beforeEach(() => {
      hashtagId = faker.datatype.number();
      deletedHashtag = new LessonHashtagEntity();

      prismaService.lessonHashtag.delete.mockReturnValue(deletedHashtag);
    });

    it('success - check method called', () => {
      lessonHashtagService.deleteOneHashtag(hashtagId);

      expect(prismaService.lessonHashtag.delete).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonHashtagService.deleteOneHashtag(hashtagId);

      expect(returnValue).toStrictEqual(deletedHashtag);
    });
  });

  describe('deleteManyHashtag', () => {
    let lessonId: number;
    let deletedManyHashtag: { count: number };

    beforeEach(() => {
      lessonId = faker.datatype.number();
      deletedManyHashtag = { count: faker.datatype.number() };

      prismaService.lessonHashtag.deleteMany.mockReturnValue(
        deletedManyHashtag,
      );
    });

    it('success - check method called', () => {
      lessonHashtagService.deleteManyHashtag(lessonId);

      expect(prismaService.lessonHashtag.deleteMany).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonHashtagService.deleteManyHashtag(lessonId);

      expect(returnValue).toStrictEqual(deletedManyHashtag);
    });
  });

  describe('readManyHashtag', () => {
    let lessonId: number;
    let hashtags: LessonHashtagEntity[];

    beforeEach(() => {
      lessonId = faker.datatype.number();
      hashtags = [new LessonHashtagEntity()];

      prismaService.lessonHashtag.findMany.mockReturnValue(hashtags);
    });

    it('success - check method called', () => {
      lessonHashtagService.readManyHashtag(lessonId);

      expect(prismaService.lessonHashtag.findMany).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonHashtagService.readManyHashtag(lessonId);

      expect(returnValue).toStrictEqual(hashtags);
    });
  });

  describe('readHashtag', () => {
    let hashtagId: number;
    let hashtag: LessonHashtagEntity;

    beforeEach(() => {
      hashtagId = faker.datatype.number();
      hashtag = new LessonHashtagEntity();

      prismaService.lessonHashtag.findUnique.mockReturnValue(hashtag);
    });

    it('success - check method called', () => {
      lessonHashtagService.readOneHashtag(hashtagId);

      expect(prismaService.lessonHashtag.findUnique).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonHashtagService.readOneHashtag(hashtagId);

      expect(returnValue).toStrictEqual(hashtag);
    });
  });
});
