import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LESSON_VIRTUAL_COLUMN_FOR_READ_MANY } from '@src/modules/lesson/constants/lesson.const';
import { CreateLessonDto } from '@src/modules/lesson/dtos/lesson/create-lesson.dto';
import { ReadManyLessonQueryDto } from '@src/modules/lesson/dtos/lesson/read-many-lesson-query.dto';
import { ReadManyLessonDto } from '@src/modules/lesson/dtos/lesson/read-many-lesson.dto';
import { ReadOneLessonDto } from '@src/modules/lesson/dtos/lesson/read-one-lesson.dto';
import { UpdateLessonDto } from '@src/modules/lesson/dtos/lesson/update-lesson.dto';
import { LessonEntity } from '@src/modules/lesson/entities/lesson.entity';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';

@Injectable()
export class LessonService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
    private readonly memberStatisticsEvent: MemberStatisticsEvent,
  ) {}

  /**
   * 과제 생성 메서드
   */
  async createLesson(
    lesson: CreateLessonDto,
    memberId: number,
  ): Promise<LessonEntity> {
    const newLesson = await this.prismaService.lesson.create({
      data: {
        ...lesson,
        memberId,
      },
    });

    // member 의 lessonCount 증가 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: 'lessonCount',
      action: 'increment',
    });

    return newLesson;
  }

  /**
   * 과제 수정 메서드
   */
  updateLesson(
    lesson: UpdateLessonDto,
    lessonId: number,
  ): Promise<LessonEntity> {
    return this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { ...lesson },
    });
  }

  /**
   * 과제 삭제 메서드
   */
  async deleteLesson(memberId: number, lessonId: number) {
    const deletedLesson = await this.prismaService.lesson.delete({
      where: { id: lessonId },
    });

    // member 의 lessonCount 증가 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: 'lessonCount',
      action: 'decrement',
    });

    return deletedLesson;
  }

  /**
   * 과제 상세조회 메서드
   */
  readOneLesson(
    lessonId: number,
    memberId: number | null,
  ): Promise<Omit<ReadOneLessonDto, 'isLike' | 'isBookmark'> | null> {
    const includeOption: Prisma.LessonInclude = {
      member: true,
      lessonCategory: true,
      lessonLevel: true,
    };

    if (memberId) {
      const whereOption = {
        where: {
          lessonId,
          memberId,
        },
      };
      includeOption.lessonBookMarks = whereOption;
      includeOption.lessonLikes = whereOption;
    }

    return this.prismaService.lesson.findFirst({
      where: {
        id: lessonId,
      },
      include: includeOption,
    });
  }

  /**
   * 과제 목록 조회 메서드
   */
  async readManyLesson(
    query: ReadManyLessonQueryDto,
  ): Promise<{ lessons: ReadManyLessonDto[]; totalCount: number }> {
    const { page, pageSize, orderBy, sortBy, ...filter } = query;

    // search 조건 build
    const where = this.queryHelper.buildWherePropForFind(filter);

    // sortBy가 가상 컬럼인 경우 { _count: orderBy } 형식으로 orderBy 세팅
    const settledOrderBy = LESSON_VIRTUAL_COLUMN_FOR_READ_MANY[sortBy]
      ? { _count: orderBy }
      : orderBy;

    // order 조건 build
    const order = this.queryHelper.buildOrderByPropForFind({
      [sortBy]: settledOrderBy,
    });

    // promise 한 lesson 목록
    const readManyLessonQuery: PrismaPromise<ReadManyLessonDto[]> =
      this.prismaService.lesson.findMany({
        where,
        orderBy: order,
        skip: page * pageSize,
        take: pageSize,
        include: {
          member: true,
          lessonCategory: true,
          _count: {
            select: {
              lessonLikes: true,
              lessonComments: true,
              lessonSolutions: true,
            },
          },
        },
      });

    // promise 한 count
    const totalCountQuery: PrismaPromise<number> =
      this.prismaService.lesson.count({ where, orderBy: order });

    const [lessons, totalCount] = await this.prismaService.$transaction([
      readManyLessonQuery,
      totalCountQuery,
    ]);

    return { lessons, totalCount };
  }

  increaseLessonHit(lessonId: number): Promise<LessonEntity> {
    return this.prismaService.lesson.update({
      where: { id: lessonId },
      data: { hit: { increment: 1 } },
    });
  }
}
