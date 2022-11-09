import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MockPrismaService } from '@src/modules/test/mock-prisma';
import { title } from 'process';
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
        description: 'description',
        title: 'title',
        levelId: 1,
      };
      memberId = 1;
    });

    it('success', async () => {
      let lesson = {
        id: 1,
        memberId: 1,
        levelId: 1,
        title: 'title',
        description: 'description',
        hit: 0,
        createdAt: '2022-11-09T11:16:37.221Z',
        updatedAt: '2022-11-09T11:16:37.221Z',
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
