import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';

export const MEMBER_FOLLOW_CREATE = 'memberFollow.create';
export const MEMBER_FOLLOW_DELETE = 'memberFollow.delete';

@Injectable()
export class MemberFriendshipsListeners {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  @OnEvent(MEMBER_FOLLOW_CREATE)
  handleMemberFollowCreateEvent(toMemberId: number, fromMemberId: number) {
    this.prismaService
      .$transaction([
        this.prismaService.memberStatistics.update({
          data: {
            followerCount: {
              increment: 1,
            },
          },
          where: {
            memberId: fromMemberId,
          },
        }),
        this.prismaService.memberStatistics.update({
          data: {
            followingCount: {
              increment: 1,
            },
          },
          where: {
            memberId: toMemberId,
          },
        }),
      ])
      .catch((e) => {
        this.notificationService
          .warning({
            description: 'handleMemberFollowCreateEvent 중 에러',
            body: {
              toMemberId,
              fromMemberId,
            },
            stack: e.stack,
          })
          .catch((e) => {
            console.error(e);
          });
      });
  }

  @OnEvent(MEMBER_FOLLOW_DELETE)
  handleMemberFollowDeleteEvent(toMemberId: number, fromMemberId: number) {
    this.prismaService
      .$transaction([
        this.prismaService.memberStatistics.update({
          data: {
            followerCount: {
              decrement: 1,
            },
          },
          where: {
            memberId: fromMemberId,
          },
        }),
        this.prismaService.memberStatistics.update({
          data: {
            followingCount: {
              decrement: 1,
            },
          },
          where: {
            memberId: toMemberId,
          },
        }),
      ])
      .catch((e) => {
        this.notificationService
          .warning({
            description: 'handleMemberFollowDeleteEvent 중 에러',
            body: {
              toMemberId,
              fromMemberId,
            },
            stack: e.stack,
          })
          .catch((e) => {
            console.error(e);
          });
      });
  }
}
