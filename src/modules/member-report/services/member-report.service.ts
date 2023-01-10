import { Injectable } from '@nestjs/common';
import { PrismaPromise } from '@prisma/client';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { FindMemberReportListQueryDto } from '@src/modules/member-report/dtos/find-member-report-list-query.dto';
import { MemberReportEntity } from '@src/modules/member-report/entities/member-report.entity';

@Injectable()
export class MemberReportService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly queryHelper: QueryHelper,
  ) {}

  async findAll(
    query: FindMemberReportListQueryDto,
  ): Promise<{ memberReports: MemberReportEntity[]; totalCount: number }> {
    const { page, pageSize, orderBy, sortBy, ...filter } = query;

    const where = this.queryHelper.buildWherePropForFind(filter);
    const order = this.queryHelper.buildOrderByPropForFind([orderBy], [sortBy]);

    const memberReportsQuery: PrismaPromise<MemberReportEntity[]> =
      this.prismaService.memberReport.findMany({
        where,
        orderBy: order,
        skip: page * pageSize,
        take: pageSize,
      });

    const totalCountQuery: PrismaPromise<number> =
      this.prismaService.memberReport.count({
        where,
        orderBy: order,
      });

    const [memberReports, totalCount] = await this.prismaService.$transaction([
      memberReportsQuery,
      totalCountQuery,
    ]);

    return { memberReports, totalCount };
  }
}
