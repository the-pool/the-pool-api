import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LessonLikeEntity } from '../entities/lesson-like.entity';
import { LessonLikeService } from './lesson-like.service';

describe('LessonLikeService', () => {
  let lessonLikeService: LessonLikeService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LessonLikeService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonLikeService = module.get<LessonLikeService>(LessonLikeService);
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createLike', () => {
    let lessonId: number;
    let memberId: number;
    let createdLike: LessonLikeEntity;

    beforeEach(() => {
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      createdLike = new LessonLikeEntity();

      prismaService.lessonLike.create.mockReturnValue(createdLike);
    });

    it('success - check method called', () => {
      lessonLikeService.createLike(lessonId, memberId);

      expect(prismaService.lessonLike.create).toBeCalledTimes(1);
      expect(prismaService.lessonLike.create).toBeCalledWith({
        data: {
          lessonId,
          memberId,
        },
      });
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonLikeService.createLike(lessonId, memberId);

      expect(returnValue).toStrictEqual(createdLike);
    });
  });

  describe('deleteLike', () => {
    let lessonId: number;
    let memberId: number;
    let deletedLike: LessonLikeEntity;

    beforeEach(() => {
      lessonId = faker.datatype.number();
      memberId = faker.datatype.number();
      deletedLike = new LessonLikeEntity();

      prismaService.lessonLike.delete.mockReturnValue(deletedLike);
    });

    it('success - check method called', () => {
      lessonLikeService.deleteLike(lessonId, memberId);

      expect(prismaService.lessonLike.delete).toBeCalledTimes(1);
      expect(prismaService.lessonLike.delete).toBeCalledWith({
        where: {
          lessonId_memberId: { lessonId, memberId },
        },
      });
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonLikeService.deleteLike(lessonId, memberId);

      expect(returnValue).toStrictEqual(deletedLike);
    });
  });
});
