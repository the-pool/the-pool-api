import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '@src/modules/solution/constants/solution.const';
import { CreateSolutionRequestBodyDto } from '@src/modules/solution/dtos/create-solution-request-body.dto';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { ReadManySolutionRequestQueryDto } from '@src/modules/solution/dtos/read-many-solution-request-query.dto';
import { UpdateSolutionRequestBodyDto } from '@src/modules/solution/dtos/update-solution-request-body.dto';
import { ReadManySolutionEntity } from '@src/modules/solution/entities/read-many-solution.entity';
import { ReadOneSolutionEntity } from '@src/modules/solution/entities/read-one-solution.entity';
import { SolutionEntity } from '@src/modules/solution/entities/solution.entity';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';

@Injectable()
export class SolutionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
    private readonly lessonSolutionRepository: LessonSolutionRepository,
    private readonly memberStatisticsEvent: MemberStatisticsEvent,
  ) {}

  async createSolution(
    requestDto: CreateSolutionRequestBodyDto,
    memberId: number,
  ): Promise<SolutionEntity> {
    const newSolution = await this.prismaService.lessonSolution.create({
      data: {
        ...requestDto,
        memberId,
      },
    });

    // member 의 lessonSolutionCount 증가 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: 'solutionCount',
      action: 'increment',
    });

    return newSolution;
  }

  updateSolution(
    requestDto: UpdateSolutionRequestBodyDto,
    solutionId: number,
  ): Promise<SolutionEntity> {
    return this.prismaService.lessonSolution.update({
      where: { id: solutionId },
      data: {
        ...requestDto,
      },
    });
  }

  async deleteSolution(
    solutionId: number,
    memberId: number,
  ): Promise<SolutionEntity> {
    const deletedSolution = await this.prismaService.lessonSolution.delete({
      where: {
        id: solutionId,
      },
    });

    // member 의 lessonSolutionCount 감소 이벤트 등록
    this.memberStatisticsEvent.register(memberId, {
      fieldName: 'solutionCount',
      action: 'decrement',
    });

    return deletedSolution;
  }

  async readOneSolution(
    solutionId: number,
    memberId: number | null,
  ): Promise<Omit<ReadOneSolutionEntity, 'isLike'>> {
    const includeOption: Prisma.LessonSolutionInclude = {};

    if (memberId) {
      includeOption.lessonSolutionLikes = {
        where: { memberId },
      };
    }

    const solution = await this.prismaService.lessonSolution.findFirst({
      where: {
        id: solutionId,
      },
      include: {
        member: true,
        ...includeOption,
      },
    });

    if (!solution) {
      throw new NotFoundException('존재하지 않는 solution입니다.');
    }

    return solution;
  }

  async readManySolution(
    query: ReadManySolutionRequestQueryDto,
    memberId: number | null,
  ): Promise<{ solutions: ReadManySolutionEntity[]; totalCount: number }> {
    const { page, pageSize, orderBy, sortBy, isLike, ...filter } = query;

    // filter 셋팅
    const where = this.queryHelper.buildWherePropForFind(filter);
    let lessonSolutionLikesWhere:
      | {
          lessonSolutionLikes: Prisma.LessonSolutionLikeListRelationFilter;
        }
      | undefined;

    console.log(memberId, isLike);

    if (memberId && isLike) {
      lessonSolutionLikesWhere = {
        lessonSolutionLikes: {
          some: {
            memberId,
          },
        },
      };
    }

    console.log(lessonSolutionLikesWhere);

    // sort기준 셋팅
    const settledOrderBy = SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY[sortBy]
      ? { _count: orderBy }
      : orderBy;
    const order = this.queryHelper.buildOrderByPropForFind({
      [sortBy]: settledOrderBy,
    });

    // promise 한 lesson 목록
    const readManySolutionQuery: PrismaPromise<ReadManySolutionEntity[]> =
      this.prismaService.lessonSolution.findMany({
        where: {
          ...where,
          ...lessonSolutionLikesWhere,
        },
        orderBy: order,
        skip: page * pageSize,
        take: pageSize,
        include: {
          member: true,
          _count: {
            select: {
              lessonSolutionComments: true,
              lessonSolutionLikes: true,
            },
          },
        },
      });

    const totalCountQuery: PrismaPromise<number> =
      this.prismaService.lessonSolution.count({
        where: {
          ...where,
          ...lessonSolutionLikesWhere,
        },
        orderBy: order,
      });

    const [solutions, totalCount] = await this.prismaService.$transaction([
      readManySolutionQuery,
      totalCountQuery,
    ]);

    return { solutions, totalCount };
  }

  async findStatisticsByMemberId(
    memberId: number,
  ): Promise<LessonSolutionStatisticsResponseBodyDto> {
    const statisticsList =
      await this.lessonSolutionRepository.findStatisticsByMemberId(memberId);

    return statisticsList[0];
  }
}
