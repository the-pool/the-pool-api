import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MockPrismaService } from '@src/modules/test/mock-prisma';
import { CreateLessonDto } from '../dtos/create-lesson.dto';
import { LessonService } from './lesson.service';

describe('LessonService', () => {
  let lessonService: LessonService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonService,
        {
          provide: PrismaService,
          useValue: MockPrismaService,
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
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
});
