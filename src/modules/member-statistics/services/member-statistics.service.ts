import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberStatisticsListQueryDto } from '@src/modules/member-statistics/dtos/find-member-statistics-list-query.dto';
import { MemberStatisticsEntity } from '@src/modules/member-statistics/entities/member-statistics.entity';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

@Injectable()
export class MemberStatisticsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
  ) {}

  /**
   * member Statistics pagination
   */
  async findAll(query: FindMemberStatisticsListQueryDto): Promise<{
    memberStatisticsList: MemberStatisticsEntity[];
    totalCount: number;
  }> {
    const { page, pageSize, orderBy, sortBy, ...filter } = query;

    // search 조건 build
    const where = this.queryHelper.buildWherePropForFind(filter);
    // order 조건 build
    const order = this.queryHelper.buildOrderByPropForFind({
      [sortBy]: orderBy,
    });

    // 프로미스한 findMany 만 만들어놓는다.
    const memberStatisticsListQuery: PrismaPromise<
      (MemberStatisticsEntity & { member: MemberEntity })[]
    > = this.prismaService.memberStatistics.findMany({
      where,
      orderBy: order,
      skip: page * pageSize,
      take: pageSize,
      include: {
        member: true,
      },
    });

    // 프로미스한 count 만 만들어놓는다.
    const totalCountQuery: PrismaPromise<number> =
      this.prismaService.memberStatistics.count({
        where,
        orderBy: order,
      });

    // transaction 을 통해 한번에 처리
    const [memberStatisticsList, totalCount] =
      await this.prismaService.$transaction([
        memberStatisticsListQuery,
        totalCountQuery,
      ]);

    return { memberStatisticsList, totalCount };
  }

  /**
   * member statistics 단일 조회
   */
  findOne(
    where: Prisma.MemberStatisticsWhereInput,
  ): Promise<MemberStatisticsEntity> {
    return this.prismaService.memberStatistics.findFirst({
      where,
    }) as Promise<MemberStatisticsEntity>;
  }
}
