import { Injectable } from '@nestjs/common';
import { Prisma, PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberReportListQueryDto } from '@src/modules/member-report/dtos/find-member-report-list-query.dto';
import { MemberReportEntity } from '@src/modules/member-report/entities/member-report.entity';
import { MemberEntity } from '@src/modules/member/entities/member.entity';

@Injectable()
export class MemberReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
  ) {}

  /**
   * member report pagination
   */
  async findAll(
    query: FindMemberReportListQueryDto,
  ): Promise<{ memberReports: MemberReportEntity[]; totalCount: number }> {
    const { page, pageSize, orderBy, sortBy, ...filter } = query;

    // search 조건 build
    const where = this.queryHelper.buildWherePropForFind(filter);
    // order 조건 build
    const order = this.queryHelper.buildOrderByPropForFind([orderBy], [sortBy]);

    // 프로미스한 findMany 만 만들어놓는다.
    const memberReportsQuery: PrismaPromise<
      (MemberReportEntity & { member: MemberEntity })[]
    > = this.prismaService.memberReport.findMany({
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
      this.prismaService.memberReport.count({
        where,
        orderBy: order,
      });

    // transaction 을 통해 한번에 처리
    const [memberReports, totalCount] = await this.prismaService.$transaction([
      memberReportsQuery,
      totalCountQuery,
    ]);

    return { memberReports, totalCount };
  }

  /**
   * member report 단일 조회
   */
  findOne(where: Prisma.MemberReportWhereInput): Promise<MemberReportEntity> {
    return this.prismaService.memberReport.findFirst({
      where,
    }) as Promise<MemberReportEntity>;
  }
}
