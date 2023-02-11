import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { LessonHashtag, LessonHashtagMapping } from '@prisma/client';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockDataStructureHelper } from '../../../../test/mock/mock-helper';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonHashtagMappingEntity } from '../entities/lesson-hashtag-mapping.entity';
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

  describe('createManyHashtag', () => {
    let lessonHashtagIds: number[];
    let lessonId: number;
    let createdLessonHashtags: (LessonHashtagMapping & {
      lessonHashtag: LessonHashtag;
    })[];

    beforeEach(() => {
      lessonHashtagIds = [faker.datatype.number()];
      lessonId = faker.datatype.number();
      createdLessonHashtags = [
        {
          ...new LessonHashtagMappingEntity(),
          ...{ lessonHashtag: new LessonHashtagEntity() },
        },
      ];
      prismaService.lessonHashtagMapping.findMany.mockReturnValue(
        createdLessonHashtags,
      );
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('success - check method called', async () => {
      await lessonHashtagService.createManyHashtag(lessonHashtagIds, lessonId);

      expect(prismaService.lessonHashtagMapping.createMany).toBeCalledTimes(1);
      expect(prismaService.lessonHashtagMapping.findMany).toBeCalledTimes(1);

      expect(dataStructureHelper.createManyMapper).toBeCalledTimes(1);
      expect(dataStructureHelper.createManyMapper).toBeCalledWith({
        lessonHashtagId: lessonHashtagIds,
        lessonId: [lessonId],
      });
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagService.createManyHashtag(
        lessonHashtagIds,
        lessonId,
      );

      expect(returnValue).toStrictEqual(createdLessonHashtags);
    });
  });

  describe('updateManyHashtag', () => {
    let lessonHashtagIds: number[];
    let lessonId: number;
    let createdLessonHashtags: (LessonHashtagMapping & {
      lessonHashtag: LessonHashtag;
    })[];
    let spyDeleteManyHashtag: jest.SpyInstance;
    let spyCreateHashtag: jest.SpyInstance;

    beforeEach(() => {
      lessonHashtagIds = [faker.datatype.number()];
      lessonId = faker.datatype.number();
      createdLessonHashtags = [
        {
          ...new LessonHashtagMappingEntity(),
          ...{ lessonHashtag: new LessonHashtagEntity() },
        },
      ];

      prismaService.lessonHashtagMapping.findMany.mockReturnValue(
        createdLessonHashtags,
      );
      spyDeleteManyHashtag = jest.spyOn(
        lessonHashtagService,
        'deleteManyHashtagByLessonId',
      );
      spyCreateHashtag = jest.spyOn(lessonHashtagService, 'createManyHashtag');
    });

    it('success - check method called', async () => {
      await lessonHashtagService.updateManyHashtag(lessonHashtagIds, lessonId);

      expect(spyDeleteManyHashtag).toBeCalledTimes(1);
      expect(spyCreateHashtag).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonHashtagService.updateManyHashtag(
        lessonHashtagIds,
        lessonId,
      );

      expect(returnValue).toStrictEqual(createdLessonHashtags);
    });
  });

  describe('deleteManyHashtagByHashtagId', () => {
    let lessonId: number;
    let lessonHashtagIds: number[];
    let deletedHashtagCount: { count: number };

    beforeEach(() => {
      lessonId = faker.datatype.number();
      lessonHashtagIds = [faker.datatype.number()];
      deletedHashtagCount = { count: faker.datatype.number() };

      prismaService.lessonHashtagMapping.deleteMany.mockReturnValue(
        deletedHashtagCount,
      );
    });

    it('success - check method called', () => {
      lessonHashtagService.deleteManyHashtagByHashtagId(
        lessonId,
        lessonHashtagIds,
      );

      expect(prismaService.lessonHashtagMapping.deleteMany).toBeCalledTimes(1);
      expect(prismaService.lessonHashtagMapping.deleteMany).toBeCalledWith({
        where: {
          lessonId,
          lessonHashtagId: { in: lessonHashtagIds },
        },
      });
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonHashtagService.deleteManyHashtagByHashtagId(
        lessonId,
        lessonHashtagIds,
      );

      expect(returnValue).toStrictEqual(deletedHashtagCount);
    });
  });

  describe('deleteManyHashtagByLessonId', () => {
    let lessonId: number;
    let deletedManyHashtag: { count: number };

    beforeEach(() => {
      lessonId = faker.datatype.number();
      deletedManyHashtag = { count: faker.datatype.number() };

      prismaService.lessonHashtagMapping.deleteMany.mockReturnValue(
        deletedManyHashtag,
      );
    });

    it('success - check method called', () => {
      lessonHashtagService.deleteManyHashtagByLessonId(lessonId);

      expect(prismaService.lessonHashtagMapping.deleteMany).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue =
        lessonHashtagService.deleteManyHashtagByLessonId(lessonId);

      expect(returnValue).toStrictEqual(deletedManyHashtag);
    });
  });

  describe('readManyHashtag', () => {
    let lessonId: number;
    let lessonHashtags: (LessonHashtagMapping & {
      lessonHashtag: LessonHashtag;
    })[];

    beforeEach(() => {
      lessonId = faker.datatype.number();
      lessonHashtags = [
        {
          ...new LessonHashtagMappingEntity(),
          ...{ lessonHashtag: new LessonHashtagEntity() },
        },
      ];

      prismaService.lessonHashtagMapping.findMany.mockReturnValue(
        lessonHashtags,
      );
    });

    it('success - check method called', () => {
      lessonHashtagService.readManyHashtag(lessonId);

      expect(prismaService.lessonHashtagMapping.findMany).toBeCalledTimes(1);
      expect(prismaService.lessonHashtagMapping.findMany).toBeCalledWith({
        where: {
          lessonId,
        },
        include: {
          lessonHashtag: true,
        },
      });
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonHashtagService.readManyHashtag(lessonId);

      expect(returnValue).toStrictEqual(lessonHashtags);
    });
  });
});
