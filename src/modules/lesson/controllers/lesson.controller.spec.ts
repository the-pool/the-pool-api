import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { IdRequestParamDto } from '@src/dtos/id-request-param.dto';
import { mockLessonService } from '../../../../test/mock/mock-services';
import { CreateLessonDto } from '../dtos/lesson/create-lesson.dto';
import { UpdateLessonDto } from '../dtos/lesson/update-lesson.dto';
import { SimilarLessonEntity } from '../entities/similar-lesson.entity';
import { LessonService } from '../services/lesson.service';
import { ReadOneLessonDto } from '../dtos/lesson/read-one-lesson.dto';
import { ReadSimilarLessonDto } from '../dtos/lesson/read-similar-lesson.dto';
import { LessonController } from './lesson.controller';
import { plainToInstance } from 'class-transformer';
import { LessonEntity } from '../entities/lesson.entity';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { SimilarLessonQueryDto } from '../dtos/lesson/similar-lesson-query.dto';

describe('LessonController', () => {
  let lessonController: LessonController;
  let lessonService;
  let prismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LessonController],
      providers: [
        {
          provide: LessonService,
          useValue: mockLessonService,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    lessonController = module.get<LessonController>(LessonController);
    lessonService = mockLessonService;
    prismaService = mockPrismaService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(lessonController).toBeDefined();
  });

  describe('createLesson', () => {
    let createLessonDto: CreateLessonDto;
    let memberId: number;
    let lesson: LessonEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      createLessonDto = {
        levelId: faker.datatype.number(),
        description: faker.lorem.text(),
        title: faker.lorem.words(),
        thumbnail: faker.image.imageUrl(),
        categoryId: faker.datatype.number(),
      };
      lesson = new LessonEntity();

      lessonService.createLesson.mockReturnValue(lesson);
    });

    it('success - check method called', async () => {
      await lessonController.createLesson(createLessonDto, memberId);

      expect(lessonService.createLesson).toBeCalledTimes(1);
      expect(lessonService.createLesson).toBeCalledWith(
        createLessonDto,
        memberId,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonController.createLesson(
        createLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lesson });
    });
  });

  describe('updateLesson', () => {
    let updateLessonDto: UpdateLessonDto;
    let memberId: number;
    let param: IdRequestParamDto;
    let updatedLesson: LessonEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      updatedLesson = new LessonEntity();
      updateLessonDto = new UpdateLessonDto();
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };

      lessonService.updateLesson.mockReturnValue(updatedLesson);
    });

    it('success - check method called', async () => {
      await lessonController.updateLesson(param, updateLessonDto, memberId);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonService.updateLesson).toBeCalledTimes(1);
      expect(lessonService.updateLesson).toBeCalledWith(
        updateLessonDto,
        param.id,
      );
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonController.updateLesson(
        param,
        updateLessonDto,
        memberId,
      );

      expect(returnValue).toStrictEqual({ lesson: updatedLesson });
    });
  });

  describe('deleteLesson', () => {
    let param: IdRequestParamDto;
    let memberId: any;
    let deletedLesson: Omit<LessonEntity, 'hashtag'>;

    beforeEach(() => {
      param = new IdRequestParamDto();
      memberId = faker.datatype.number();
      deletedLesson = new LessonEntity();

      lessonService.deleteLesson.mockReturnValue(deletedLesson);
    });

    it('success - check method called', async () => {
      await lessonController.deleteLesson(param, memberId);

      expect(prismaService.validateOwnerOrFail).toBeCalledTimes(1);
      expect(lessonService.deleteLesson).toBeCalledTimes(1);
      expect(lessonService.deleteLesson).toBeCalledWith(param.id);
    });

    it('success - check Input & Output', async () => {
      const result = await lessonController.deleteLesson(param, memberId);

      expect(result).toStrictEqual({ lesson: deletedLesson });
    });
  });

  describe('readOneLesson', () => {
    let param: IdRequestParamDto;
    let member: any;
    let readOneLesson: ReadOneLessonDto;

    beforeEach(() => {
      readOneLesson = new ReadOneLessonDto();
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };
      member = {
        id: faker.datatype.number(),
      };

      lessonService.readOneLesson.mockReturnValue(readOneLesson);
    });

    it('success - check method called', async () => {
      await lessonController.readOneLesson(param, member);

      expect(lessonService.readOneLesson).toBeCalledTimes(1);
      expect(lessonService.readOneLesson).toBeCalledWith(param.id, member.id);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonController.readOneLesson(param, member);

      expect(returnValue).toStrictEqual({ lesson: readOneLesson });
    });
  });

  describe('readSimilarLesson', () => {
    let param: IdRequestParamDto;
    let member: any;
    let query: SimilarLessonQueryDto;
    let readSimilarLessons: SimilarLessonEntity[];

    beforeEach(() => {
      member = { id: faker.datatype.number() };
      param = {
        id: faker.datatype.number(),
        model: 'lesson',
      };
      query = new SimilarLessonQueryDto();
      readSimilarLessons = [new SimilarLessonEntity()];

      lessonService.readSimilarLesson.mockReturnValue(readSimilarLessons);
    });

    it('success - check method called', async () => {
      await lessonController.readSimilarLesson(param, query, member);

      expect(lessonService.readSimilarLesson).toBeCalledTimes(1);
      expect(lessonService.readSimilarLesson).toBeCalledWith(
        param.id,
        member.id,
        query,
      );
    });

    it('success - Input & Output', async () => {
      readSimilarLessons = plainToInstance(SimilarLessonEntity, [
        {
          isBookmark: faker.datatype.number(),
        },
      ]);
      lessonService.readSimilarLesson.mockReturnValue(readSimilarLessons);

      const returnValue = await lessonController.readSimilarLesson(
        param,
        query,
        member,
      );

      expect(typeof returnValue.lessons[0].isBookmark).toBe('boolean');
      expect(returnValue).toBeInstanceOf(ReadSimilarLessonDto);
    });
  });
});
