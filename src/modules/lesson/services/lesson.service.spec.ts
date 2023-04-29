import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { EntityId } from '@src/constants/enum';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { mockQueryHelper } from '../../../../test/mock/mock-helpers';
import { mockPrismaService } from '../../../../test/mock/mock-prisma-service';
import { LESSON_VIRTUAL_COLUMN_FOR_READ_MANY } from '../constants/lesson.const';
import { LessonVirtualColumn } from '../constants/lesson.enum';
import { CreateLessonDto } from '../dtos/lesson/create-lesson.dto';
import { ReadManyLessonQueryDto } from '../dtos/lesson/read-many-lesson-query.dto';
import { ReadManyLessonDto } from '../dtos/lesson/read-many-lesson.dto';
import { ReadOneLessonDto } from '../dtos/lesson/read-one-lesson.dto';
import { UpdateLessonDto } from '../dtos/lesson/update-lesson.dto';
import { LessonEntity } from '../entities/lesson.entity';
import { LessonService } from './lesson.service';
import { mockEventEmitter } from '@test/mock/mock-libs';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { LESSON_HIT_EVENT } from '../listeners/lesson-hit.listener';
import { LessonHitEvent } from '../events/lesson-hit.event';

describe('LessonService', () => {
  let lessonService: LessonService;
  let prismaService;
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
          provide: QueryHelper,
          useValue: mockQueryHelper,
        },
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter,
        },
      ],
    }).compile();

    lessonService = module.get<LessonService>(LessonService);
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

      prismaService.lesson.create.mockResolvedValue(createdLesson);
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

      prismaService.lesson.update.mockResolvedValue(updatedLesson);
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
    let memberId: number | null;
    let lessonId: number;
    let lesson;
    let lessonHitEvent: LessonHitEvent;

    describe('memberId is number', () => {
      beforeEach(() => {
        memberId = faker.datatype.number();
        lessonId = faker.datatype.number();
        lesson = new ReadOneLessonDto();
        lessonHitEvent = new LessonHitEvent('increment', lessonId);

        delete lesson.isLike;
        delete lesson.isBookmark;

        prismaService.lesson.findFirst.mockReturnValue(lesson);
        mockEventEmitter.emit.mockReturnValue(true);
      });

      it('success - check method called', async () => {
        await lessonService.readOneLesson(lessonId, memberId);
        const includeOption = {
          member: true,
          lessonCategory: true,
          lessonLevel: true,
          lessonBookMarks: {
            where: {
              lessonId,
              memberId,
            },
          },
          lessonLikes: {
            where: {
              lessonId,
              memberId,
            },
          },
        };

        expect(prismaService.lesson.findFirst).toBeCalledTimes(1);
        expect(prismaService.lesson.findFirst).toBeCalledWith({
          where: { id: lessonId },
          include: includeOption,
        });
        expect(mockEventEmitter.emit).toBeCalledTimes(1);
        expect(mockEventEmitter.emit).toBeCalledWith(
          LESSON_HIT_EVENT,
          lessonHitEvent,
        );
      });

      it('success - check Input & Output', async () => {
        const returnValue = await lessonService.readOneLesson(
          lessonId,
          memberId,
        );

        expect(returnValue).toStrictEqual(lesson);
      });
    });
    describe('memberId is null', () => {
      beforeEach(() => {
        memberId = null;
        lessonId = faker.datatype.number();
        lesson = new ReadOneLessonDto();
        lessonHitEvent = new LessonHitEvent('increment', lessonId);
        delete lesson.isLike;
        delete lesson.isBookmark;
        delete lesson.lessonBookMarks;
        delete lesson.lessonLikes;

        prismaService.lesson.findFirst.mockReturnValue(lesson);
      });

      it('success - check method called', async () => {
        await lessonService.readOneLesson(lessonId, memberId);
        const includeOption = {
          member: true,
          lessonCategory: true,
          lessonLevel: true,
        };

        expect(prismaService.lesson.findFirst).toBeCalledTimes(1);
        expect(prismaService.lesson.findFirst).toBeCalledWith({
          where: { id: lessonId },
          include: includeOption,
        });
        expect(mockEventEmitter.emit).toBeCalledTimes(1);
        expect(mockEventEmitter.emit).toBeCalledWith(
          LESSON_HIT_EVENT,
          lessonHitEvent,
        );
      });

      it('success - check Input & Output', async () => {
        const returnValue = await lessonService.readOneLesson(
          lessonId,
          memberId,
        );

        expect(returnValue).toStrictEqual(lesson);
      });
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
