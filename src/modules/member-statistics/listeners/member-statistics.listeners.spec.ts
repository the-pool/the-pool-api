import { faker } from '@faker-js/faker';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { MemberStatisticsListeners } from '@src/modules/member-statistics/listeners/member-statistics.listeners';
import { IMemberStatisticsEvent } from '@src/modules/member-statistics/types/member-statistics.type';
import { mockPrismaService } from '@test/mock/mock-prisma-service';
import { mockNotificationService } from '@test/mock/mock-services';

describe('MemberStatisticsListeners', () => {
  let listeners: MemberStatisticsListeners;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberStatisticsListeners,
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

    listeners = module.get<MemberStatisticsListeners>(
      MemberStatisticsListeners,
    );
  });

  describe('handleMemberStatisticsCountEvent', () => {
    let memberId: number;
    let memberStatisticsEvent: IMemberStatisticsEvent;

    beforeEach(() => {
      memberId = faker.datatype.number();
      memberStatisticsEvent = {
        fieldName: 'solutionCount',
        action: 'increment',
        count: 1,
      };
    });

    it('update 성공', () => {
      mockPrismaService.memberStatistics.update.mockResolvedValue(
        Promise.resolve() as any,
      );

      expect(
        listeners.handleMemberStatisticsCountEvent(
          memberId,
          memberStatisticsEvent,
        ),
      ).toBeUndefined();
      expect(mockNotificationService.warning).not.toBeCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });
});
