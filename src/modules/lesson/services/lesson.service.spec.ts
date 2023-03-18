import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityId } from '@src/constants/enum';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockQueryHelper } from '../../../../test/mock/mock-helpers';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { mockLessonRepository } from '../../../../test/mock/mock-repositories';
import { LESSON_VIRTUAL_COLUMN_FOR_READ_MANY } from '../constants/lesson.const';
import { LessonVirtualColumn } from '../constants/lesson.enum';
import { CreateLessonDto } from '../dtos/lesson/create-lesson.dto';
import { ReadManyLessonQueryDto } from '../dtos/lesson/read-many-lesson-query.dto';
import { ReadManyLessonDto } from '../dtos/lesson/read-many-lesson.dto';
import { UpdateLessonDto } from '../dtos/lesson/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonRepository } from '../repositories/lesson.repository';
import { LessonService } from './lesson.service';

describe('LessonService', () => {
  let lessonService: LessonService;
  let prismaService;
  let lessonRepository;
  let queryHelper;

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
        {
          provide: QueryHelper,
          useValue: mockQueryHelper,
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
    lessonRepository = mockLessonRepository;
    prismaService = mockPrismaService;
    queryHelper = mockQueryHelper;
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
    let lesson: LessonEntity;

    beforeEach(() => {
      memberId = faker.datatype.number();
      lessonId = faker.datatype.number();
      lesson = new LessonEntity();

      lessonRepository.readOneLesson.mockReturnValue(lesson);
    });
    it('success - check method called', () => {
      lessonService.readOneLesson(lessonId, memberId);

      expect(lessonRepository.readOneLesson).toBeCalledTimes(1);
      expect(lessonRepository.readOneLesson).toBeCalledWith(lessonId, memberId);
    });

    it('success - check Input & Output', () => {
      const returnValue = lessonService.readOneLesson(lessonId, memberId);

      expect(returnValue).toStrictEqual(lesson);
    });
  });

  describe('readManyLesson', () => {
    let query: ReadManyLessonQueryDto;
    let readManyLesson: ReadManyLessonDto[];
    let totalCount: number;

    beforeEach(() => {
      query = new ReadManyLessonQueryDto();
      readManyLesson = [new ReadManyLessonDto()];
      totalCount = faker.datatype.number();
      prismaService.lesson.findMany.mockResolvedValue(readManyLesson);
      prismaService.lesson.count.mockResolvedValue(totalCount);
      prismaService.$transaction.mockResolvedValue([
        readManyLesson,
        totalCount,
      ]);
    });

    it('success - check method called', async () => {
      const { page, pageSize, orderBy, sortBy, ...filter } = query;
      const settledOrderBy = LESSON_VIRTUAL_COLUMN_FOR_READ_MANY[sortBy]
        ? { _count: orderBy }
        : orderBy;

      await lessonService.readManyLesson(query);

      expect(queryHelper.buildOrderByPropForFind).toBeCalledTimes(1);
      expect(queryHelper.buildWherePropForFind).toBeCalledWith(filter);
      expect(queryHelper.buildOrderByPropForFind).toBeCalledTimes(1);
      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [sortBy]: settledOrderBy,
      });
      expect(prismaService.lesson.findMany).toBeCalledTimes(1);
      expect(prismaService.lesson.count).toBeCalledTimes(1);
    });

    it('success - check Input & Output', async () => {
      const returnValue = await lessonService.readManyLesson(query);

      expect(returnValue).toStrictEqual({
        lessons: readManyLesson,
        totalCount,
      });
    });

    it('case - sortBy is virtualColumn', async () => {
      query.sortBy = LessonVirtualColumn.LessonSolutions;

      await lessonService.readManyLesson(query);

      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [query.sortBy]: { _count: query.orderBy },
      });
    });

    it('case - sortBy is not virtualColumn', async () => {
      query.sortBy = EntityId.Id;

      await lessonService.readManyLesson(query);

      expect(queryHelper.buildOrderByPropForFind).toBeCalledWith({
        [query.sortBy]: query.orderBy,
      });
    });
  });
});
