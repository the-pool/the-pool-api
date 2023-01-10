import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberReportController } from '@src/modules/member-report/controllers/member-report.controller';
import { MemberReportService } from './services/member-report.service';

@Module({
  controllers: [MemberReportController],
  providers: [MemberReportService, PrismaService, QueryHelper],
})
export class MemberReportModule {}
