import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { LessonSolutionStatisticsResponseBodyDto } from '@src/modules/solution/dtos/lesson-solution-statistics-response-body.dto';
import { LessonSolutionRepository } from '@src/modules/solution/repositories/lesson-solution.repository';
import { CreateSolutionRequestBodyDto } from '../dtos/create-solution-request-body.dto';
import { SolutionEntity } from '../entities/solution.entity';
import { ReadManySolutionRequestQueryDto } from '../dtos/read-many-solution-request-query.dto';
import { QueryHelper } from '@src/helpers/query.helper';
import { SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY } from '../constants/solution.const';
import { Prisma, PrismaPromise } from '@prisma/client';
import { ReadManySolutionEntity } from '../entities/read-many-solution.entity';
import { ReadOneSolutionEntity } from '../entities/read-one-solution.entity';

@Injectable()
export class SolutionService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
    private readonly lessonSolutionRepository: LessonSolutionRepository,
  ) {}

  createSolution(
    requestDto: CreateSolutionRequestBodyDto,
    memberId: number,
  ): Promise<SolutionEntity> {
    return this.prismaService.lessonSolution.create({
      data: {
        ...requestDto,
        memberId,
      },
    });
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
  ): Promise<{ solutions: ReadManySolutionEntity[]; totalCount: number }> {
    const { page, pageSize, orderBy, sortBy, ...filter } = query;

    // filter 셋팅
    const where = this.queryHelper.buildWherePropForFind(filter);

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
        where,
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
      this.prismaService.lessonSolution.count({ where, orderBy: order });

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
