import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { MemberFriendshipsListeners } from '@src/modules/member-friendship/listeners/member-friendships.listeners';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockNotificationService } from '@test/mock/mock-services';

describe('MemberFriendshipsListeners', () => {
  let listeners: MemberFriendshipsListeners;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberFriendshipsListeners,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    listeners = module.get<MemberFriendshipsListeners>(
      MemberFriendshipsListeners,
    );
  });

  describe('handleMemberFollowCreateEvent', () => {
    let toMemberId: number;
    let fromMemberId: number;

    beforeEach(() => {
      toMemberId = faker.datatype.number();
      fromMemberId = faker.datatype.number();

      mockPrismaService.$transaction.mockResolvedValue([]);
    });

    it('follow count', () => {
      expect(
        listeners.handleMemberFollowCreateEvent(toMemberId, fromMemberId),
      ).toBeUndefined();

      expect(mockPrismaService.memberStatistics.update).toBeCalledWith(
        expect.objectContaining({
          data: {
            followerCount: {
              increment: 1,
            },
          },
        }),
      );
      expect(mockPrismaService.memberStatistics.update).toBeCalledWith(
        expect.objectContaining({
          data: {
            followingCount: {
              increment: 1,
            },
          },
        }),
      );
      expect(mockPrismaService.memberStatistics.update).toBeCalledTimes(2);
    });

    it('unfollow count', () => {
      expect(
        listeners.handleMemberFollowDeleteEvent(toMemberId, fromMemberId),
      ).toBeUndefined();

      expect(mockPrismaService.memberStatistics.update).toBeCalledWith(
        expect.objectContaining({
          data: {
            followerCount: {
              decrement: 1,
            },
          },
        }),
      );
      expect(mockPrismaService.memberStatistics.update).toBeCalledWith(
        expect.objectContaining({
          data: {
            followingCount: {
              decrement: 1,
            },
          },
        }),
      );
      expect(mockPrismaService.memberStatistics.update).toBeCalledTimes(2);
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
