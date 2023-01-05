import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonRepository } from '../../../../test/mock/mock-repositories';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/similar-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonService } from './lesson.service';

describe('LessonService', () => {
  let lessonService: LessonService;
  let prismaService;
  let lessonRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonService).toBeDefined();
  });

  describe('createLesson', () => {
    let createLessonDto: CreateLessonDto;
    let memberId: number;

    beforeEach(() => {
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
    let updatedLesson;

    beforeEach(() => {
      lesson = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
      };
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      updatedLesson = JSON.parse(faker.datatype.json());

      prismaService.lesson.update.mockReturnValue(updatedLesson);
    });

    it('success', async () => {
      const returnValue = await lessonService.updateLesson(lesson, lessonId);

      expect(returnValue).toStrictEqual(updatedLesson);
    });
  });

  describe('deleteLesson', () => {
    let lesson;
    let memberId: number;
    let lessonId: number;
    let deletedLesson;

    beforeEach(() => {
      lesson = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
      };
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      deletedLesson = JSON.parse(faker.datatype.json());

      prismaService.lesson.delete.mockReturnValue(deletedLesson);
    });

    it('success', async () => {
      const returnValue = await lessonService.deleteLesson(lessonId);

      expect(mockPrismaService.lesson.delete).toBeCalledTimes(1);
      expect(returnValue).toStrictEqual(deletedLesson);
    });
  });

  describe('readOneLesson', () => {
    let memberId: number;
    let lessonId: number;

    beforeEach(() => {
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
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

    beforeEach(() => {
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
