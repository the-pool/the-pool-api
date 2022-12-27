import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockLessonRepository } from '../../../../test/mock/mock-repositories';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonService } from './lesson.service';
import { LessonEntity } from '../entities/lesson.entity';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { mockPrismaHelper } from '../../../../test/mock/mock-helper';

describe('LessonService', () => {
  let lessonService: LessonService;
  let prismaService;
  let prismaHelper;
  let lessonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        DataStructureHelper,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: PrismaHelper,
          useValue: mockPrismaHelper,
        },
        {
          provide: LessonRepository,
          useValue: mockLessonRepository,
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
    lessonRepository = mockLessonRepository;
    prismaService = mockPrismaService;
  });

  it('should be defined', () => {
    expect(lessonService).toBeDefined();
  });

  describe('createLesson', () => {
    let createLessonDto: CreateLessonDto;
    let memberId: number;

    beforeEach(async () => {
      createLessonDto = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        thumbnail: faker.image.imageUrl(),
        categoryId: faker.datatype.number({ min: 1, max: 9 }),
      };
      memberId = 1;
    });

    it('success', async () => {
      const lesson = {
        id: faker.datatype.number(),
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        hit: faker.datatype.number(),
        createdAt: faker.date.soon(),
        updatedAt: faker.date.soon(),
        deletedAt: null,
      };

      prismaService.lesson.create.mockReturnValue(lesson);

      const returnValue = await lessonService.createLesson(
        createLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual(lesson);
    });
  });

  describe('updateLesson', () => {
    let lesson;
    let memberId: number;
    let lessonId: number;
    let mockUpdatedLesson;

    beforeEach(async () => {
      lesson = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
      };
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      mockUpdatedLesson = JSON.parse(faker.datatype.json());
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      prismaService.lesson.update.mockReturnValue(mockUpdatedLesson);

      const returnValue = await lessonService.updateLesson(
        lesson,
        memberId,
        lessonId,
      );

      expect(returnValue).toStrictEqual(mockUpdatedLesson);
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      const returnValue = await lessonService.deleteLesson(memberId, lessonId);

      expect(prismaHelper.findOneOrFail).toBeCalledTimes(1);
      expect(mockPrismaService.lesson.delete).toBeCalledTimes(1);
      expect(returnValue).toBeInstanceOf(LessonEntity);
    });
  });

  describe('readOneLesson', () => {
    let memberId: number;
    let lessonId: number;

    beforeEach(async () => {
      (memberId = faker.datatype.number()),
        (lessonId = faker.datatype.number());
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      const lesson = faker.datatype.string();
      const lessonLevelEvaluation = faker.datatype.string();
      const lessonHashtag = faker.datatype.array();

      lessonRepository.readOneLesson.mockReturnValue(lesson);
      lessonRepository.readLessonLevelEvaluation.mockReturnValue(
        lessonLevelEvaluation,
      );
      lessonRepository.readLessonHashtag.mockReturnValue(lessonHashtag);

      const returnValue = await lessonService.readOneLesson(lessonId, memberId);

      expect(returnValue).toStrictEqual(
        Object.assign({}, lesson, lessonHashtag, { lessonLevelEvaluation }),
      );
    });
  });

  describe('readSimilarLesson', () => {
    let memberId: number;
    let lessonId: number;
    let query: SimilarLessonQueryDto;
    let mockSimilarLessons: SimilarLessonEntity;

    beforeEach(async () => {
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      query = new SimilarLessonQueryDto();
      mockSimilarLessons = JSON.parse(faker.datatype.json());

      mockLessonRepository.readSimilarLesson.mockReturnValue(
        mockSimilarLessons,
      );
    });

    it('success', async () => {
      await lessonService.readSimilarLesson(lessonId, memberId, query);

      expect(mockLessonRepository.readSimilarLesson).toHaveBeenCalledTimes(1);
      expect(mockLessonRepository.readSimilarLesson).toBeCalledWith(
        lessonId,
        memberId,
        query,
      );
    });
  });
});
