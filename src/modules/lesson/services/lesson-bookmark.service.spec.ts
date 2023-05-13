import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonBookmarkEntity } from '@src/modules/lesson/entities/lesson-bookmark.entity';
import { LessonBookmarkService } from '@src/modules/lesson/services/lesson-bookmark.service';
import { mockPrismaService } from '@test/mock/mock-prisma-service';

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
      expect(prismaService.lessonBookmark.create).toBeCalledWith({
        data: {
          lessonId,
          memberId,
        },
      });
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonBookmarkService.createBookmark(
        lessonId,
        memberId,
      );

      expect(returnValue).toStrictEqual(createdBookmark);
    });
  });

  describe('deleteBookmark', () => {
    let lessonId: number;
    let memberId: number;
    let deletedBookmark: LessonBookmarkEntity;

    beforeEach(() => {
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      deletedBookmark = new LessonBookmarkEntity();

      prismaService.lessonBookmark.delete.mockReturnValue(deletedBookmark);
    });

    it('success - check method called', () => {
      lessonBookmarkService.deleteBookmark(lessonId, memberId);

      expect(prismaService.lessonBookmark.delete).toBeCalledTimes(1);
      expect(prismaService.lessonBookmark.delete).toBeCalledWith({
        where: {
          lessonId_memberId: { lessonId, memberId },
        },
      });
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonBookmarkService.deleteBookmark(
        lessonId,
        memberId,
      );

      expect(returnValue).toStrictEqual(deletedBookmark);
    });
  });
});
