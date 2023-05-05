import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { IMemberStatisticsEvent } from '@src/modules/member-statistics/types/member-statistics.type';

export const MEMBER_STATISTICS_COUNT = 'memberStatistics.count';

@Injectable()
export class MemberStatisticsListeners {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(MEMBER_STATISTICS_COUNT)
  handleMemberStatisticsCountEvent(
    memberId: number,
    memberStatisticsEvent: IMemberStatisticsEvent,
  ): void {
    const { fieldName, action, count } = memberStatisticsEvent;

    this.prismaService.memberStatistics
      .update({
        data: {
          [fieldName]: {
            [action]: count,
          },
        },
        where: {
          memberId,
        },
      })
      .catch((e) => {
        this.notificationService
          .warning({
            description: 'handleMemberStatisticsCountEvent 중 에러',
            body: {
              memberId,
              fieldName,
              action,
              count,
            },
            stack: e.stack,
          })
          .catch((e) => {
            console.error(e);
          });
      });
  }
}
