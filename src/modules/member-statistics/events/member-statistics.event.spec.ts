import { faker } from '@faker-js/faker';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { IMemberStatisticsEvent } from '@src/modules/member-statistics/types/member-statistics.type';
import { mockEventEmitter2 } from '@test/mock/mock-libs';

describe('MemberStatisticsEvent', () => {
  let event: MemberStatisticsEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberStatisticsEvent,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter2,
        },
      ],
    }).compile();

    event = module.get<MemberStatisticsEvent>(MemberStatisticsEvent);
  });

  describe('register', () => {
    let memberId: number;
    let memberStatisticsEvent: IMemberStatisticsEvent;

    beforeEach(() => {
      memberId = faker.datatype.number();
      memberStatisticsEvent = {
        fieldName: 'solutionCount',
        action: 'increment',
      };

      mockEventEmitter2.emit.mockReturnValue(true);
    });

    it('count 가 들어온 경우', () => {
      const count = faker.datatype.number({ min: 1 });
      memberStatisticsEvent.count = count;

      expect(event.register(memberId, memberStatisticsEvent)).toBe(true);
      expect(mockEventEmitter2.emit).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        {
          count,
          fieldName: expect.anything(),
          action: expect.anything(),
        },
      );
    });

    it('count 가 들어오지 않은 경우', () => {
      expect(event.register(memberId, memberStatisticsEvent)).toBe(true);
      expect(mockEventEmitter2.emit).toBeCalledWith(
        expect.anything(),
        expect.anything(),
        {
          count: 1,
          fieldName: expect.anything(),
          action: expect.anything(),
        },
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
