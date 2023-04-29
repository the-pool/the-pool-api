import { Module } from '@nestjs/common';
import { QueryHelper } from '@src/helpers/query.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { MemberStatisticsController } from '@src/modules/member-statistics/controllers/member-statistics.controller';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { MemberStatisticsListeners } from '@src/modules/member-statistics/listeners/member-statistics.listeners';
import { MemberStatisticsService } from '@src/modules/member-statistics/services/member-statistics.service';

@Module({
  controllers: [MemberStatisticsController],
  providers: [
    MemberStatisticsService,
    PrismaService,
    QueryHelper,
    MemberStatisticsListeners,
    MemberStatisticsEvent,
  ],
  exports: [MemberStatisticsEvent],
})
export class MemberStatisticsModule {}
