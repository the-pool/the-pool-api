import { faker } from '@faker-js/faker';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { plainToInstance } from 'class-transformer';
import { mockLessonRepository } from '../../../../test/mock/mock-repositories';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
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
        DataStructureHelper,
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
        hashtags: ['1', '2', '3'],
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
    let memebrId: number;
    let lessonId: number;
    let mockUpdatedLesson;

    beforeEach(async () => {
      lesson = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
      };
      memebrId = faker.datatype.number();
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
        memebrId,
        lessonId,
      );

      expect(returnValue).toStrictEqual(mockUpdatedLesson);
    });

    it('false - 과제 작성자가 아닌 사람이 과제를 수정하려고 할 때', async () => {
      prismaService.lesson.updateMany.mockReturnValue({ count: 0 });

      await expect(async () => {
        await lessonService.updateLesson(lesson, memebrId, lessonId);
      }).rejects.toThrowError(
        new ForbiddenException('과제를 수정할 권한이 없습니다.'),
      );
    });
  });

  describe('updateLessonHashtag', () => {
    let hashtags: string[];
    let lessonId: number;
    let updatedHashtags;

    beforeEach(async () => {
      hashtags = ['1', '2', '3'];
      lessonId = faker.datatype.number();
      updatedHashtags = [{ tag: '1' }, { tag: '2' }, { tag: '3' }];
    });
    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      prismaService.lessonHashtag.deleteMany.mockReturnValue({ count: 1 });
      prismaService.lessonHashtag.createMany.mockReturnValue({ count: 3 });
      prismaService.lessonHashtag.findMany.mockReturnValue(updatedHashtags);

      const returnValue = await lessonService.updateLessonHashtag(
        hashtags,
        lessonId,
      );

      expect(returnValue).toEqual(hashtags);
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
