import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonRepository } from '../../../../test/mock/mock-repositories';
import { CreateLessonDto } from '../dtos/lesson/create-lesson.dto';
import { SimilarLessonQueryDto } from '../dtos/lesson/similar-lesson.dto';
import { UpdateLessonDto } from '../dtos/lesson/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
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
    let createdLesson: LessonEntity;

    beforeEach(() => {
      createLessonDto = new CreateLessonDto();
      memberId = 1;
      createdLesson = new LessonEntity();

      prismaService.lesson.create.mockReturnValue(createdLesson);
    });

    it('success - check method called', async () => {
      await lessonService.createLesson(createLessonDto, memberId);

      expect(prismaService.lesson.create).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonService.createLesson(
        createLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual(createdLesson);
    });
  });

  describe('updateLesson', () => {
    let lesson: UpdateLessonDto;
    let memberId: number;
    let lessonId: number;
    let updatedLesson: LessonEntity;

    beforeEach(() => {
      lesson = new UpdateLessonDto();
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      updatedLesson = new LessonEntity();

      prismaService.lesson.update.mockReturnValue(updatedLesson);
    });

    it('success - check method called', async () => {
      await lessonService.updateLesson(lesson, lessonId);

      expect(prismaService.lesson.update).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonService.updateLesson(lesson, lessonId);

      expect(returnValue).toStrictEqual(updatedLesson);
    });
  });

  describe('deleteLesson', () => {
    let memberId: number;
    let lessonId: number;
    let deletedLesson: LessonEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      deletedLesson = new LessonEntity();

      prismaService.lesson.delete.mockReturnValue(deletedLesson);
    });

    it('success - check method called', async () => {
      await lessonService.deleteLesson(lessonId);

      expect(mockPrismaService.lesson.delete).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonService.deleteLesson(lessonId);

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
    // 과제 평가 api를 생성하는 pr에서 test 하겠습니다.
    xit('success', async () => {
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
    let readSimilarLessons: SimilarLessonEntity[];

    beforeEach(() => {
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      query = new SimilarLessonQueryDto();
      readSimilarLessons = [new SimilarLessonEntity()];

      lessonRepository.readSimilarLesson.mockReturnValue(readSimilarLessons);
    });

    it('success - check method called', async () => {
      await lessonService.readSimilarLesson(lessonId, memberId, query);

      expect(lessonRepository.readSimilarLesson).toHaveBeenCalledTimes(1);
      expect(lessonRepository.readSimilarLesson).toBeCalledWith(
        lessonId,
        memberId,
        query,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonService.readSimilarLesson(
        lessonId,
        memberId,
        query,
      );

      expect(returnValue).toStrictEqual(readSimilarLessons);
    });
  });
});
