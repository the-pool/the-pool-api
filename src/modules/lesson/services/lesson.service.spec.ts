import { faker } from '@faker-js/faker';
import { ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataStructureHelper } from '@src/helpers/data-structure.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MockPrismaService } from '@src/modules/test/mock-prisma';
import { MockLessonRepository } from '@src/modules/test/mock-repository';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
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
          useValue: MockPrismaService,
        },
        {
          provide: LessonRepository,
          useValue: MockLessonRepository,
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
    lessonRepository = MockLessonRepository;
    prismaService = MockPrismaService;
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
        hashtag: ['1', '2', '3'],
      };
      memberId = 1;
    });

    it('success', async () => {
      let lesson = {
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

    beforeEach(async () => {
      lesson = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
      };
      (memebrId = faker.datatype.number()),
        (lessonId = faker.datatype.number());
    });

    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      prismaService.lesson.updateMany.mockReturnValue({ count: 1 });

      const returnValue = await lessonService.updateLesson(
        lesson,
        memebrId,
        lessonId,
      );

      expect(returnValue).toBeUndefined();
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
    let hashtag: string[];
    let lessonId: number;

    beforeEach(async () => {
      hashtag = ['1', '2', '3'];
      lessonId = faker.datatype.number();
    });
    afterEach(async () => {
      jest.clearAllMocks();
    });

    it('success', async () => {
      prismaService.lessonHashtag.deleteMany.mockReturnValue({ count: 1 });
      prismaService.lessonHashtag.createMany.mockReturnValue({ count: 3 });

      const returnValue = await lessonService.updateLessonHashtag(
        hashtag,
        lessonId,
      );

      expect(returnValue).toBeUndefined();
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
      const oneLesson = [
        {
          title: faker.lorem.words(),
          description: faker.lorem.text(),
          hit: faker.datatype.number(),
          updatedAt: new Date(),
          memberId: faker.datatype.number(),
          nickname: faker.lorem.words(),
          levelId: faker.datatype.number(),
          solutionCount: faker.datatype.number(),
          hashtag: ['1', '2', '3'],
          isBookmark: false,
          isLike: false,
        },
      ];
      const lessonLevelEvaluation = [
        {
          top: faker.datatype.number(),
          middle: faker.datatype.number(),
          bottom: faker.datatype.number(),
        },
      ];
      lessonRepository.readOneLesson.mockReturnValue(oneLesson);
      lessonRepository.lessonLevelEvaluation.mockReturnValue(
        lessonLevelEvaluation,
      );

      const returnValue = await lessonService.readOneLesson(lessonId, memberId);
      console.log(returnValue);

      expect(returnValue).toStrictEqual(
        Object.assign({}, oneLesson[0], {
          lessonLevelEvaluation: lessonLevelEvaluation[0],
        }),
      );
    });
  });
});
