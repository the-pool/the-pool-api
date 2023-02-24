import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonBookmarkEntity } from '../entities/lesson-bookmark.entity';
import { LessonBookmarkService } from './lesson-bookmark.service';

describe('LessonBookmarkService', () => {
  let lessonBookmarkService: LessonBookmarkService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonBookmarkService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    lessonBookmarkService = module.get<LessonBookmarkService>(
      LessonBookmarkService,
    );
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createBookmark', () => {
    let lessonId: number;
    let memberId: number;
    let createdBookmark: LessonBookmarkEntity;

    beforeEach(() => {
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      createdBookmark = new LessonBookmarkEntity();

      prismaService.lessonBookmark.create.mockReturnValue(createdBookmark);
    });

    it('success - check method called', () => {
      lessonBookmarkService.createBookmark(lessonId, memberId);

      expect(prismaService.lessonBookmark.create).toBeCalledTimes(1);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonBookmarkService.createBookmark(
        lessonId,
        memberId,
      );

      expect(returnValue).toStrictEqual(createdBookmark);
    });
  });
});
