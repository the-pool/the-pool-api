import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsController } from '@src/modules/member-statistics/controllers/member-statistics.controller';
import { MemberStatisticsService } from './services/member-statistics.service';

@Module({
  controllers: [MemberStatisticsController],
  providers: [MemberStatisticsService, PrismaService, QueryHelper],
})
export class MemberStatisticsModule {}
