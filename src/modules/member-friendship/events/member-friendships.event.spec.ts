import { faker } from '@faker-js/faker';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { MemberFriendshipsEvent } from '@src/modules/member-friendship/events/member-friendships.event';
import {
  MEMBER_FOLLOW_CREATE,
  MEMBER_FOLLOW_DELETE,
} from '@src/modules/member-friendship/listeners/member-friendships.listeners';
import { mockEventEmitter2 } from '@test/mock/mock-libs';

describe('MemberFriendshipsEvent', () => {
  let event: MemberFriendshipsEvent;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MemberFriendshipsEvent,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter2,
        },
      ],
    }).compile();

    event = module.get<MemberFriendshipsEvent>(MemberFriendshipsEvent);
  });

  describe('follow', () => {
    let toMemberId: number;
    let fromMemberId: number;

    beforeEach(() => {
      toMemberId = faker.datatype.number();
      fromMemberId = faker.datatype.number();

      mockEventEmitter2.emit.mockReturnValue(true);
    });

    it('event register', () => {
      expect(event.follow(toMemberId, fromMemberId)).toBe(true);

      expect(mockEventEmitter2.emit).toBeCalledWith(
        MEMBER_FOLLOW_CREATE,
        toMemberId,
        fromMemberId,
      );
    });
  });

  describe('unfollow', () => {
    let toMemberId: number;
    let fromMemberId: number;

    beforeEach(() => {
      toMemberId = faker.datatype.number();
      fromMemberId = faker.datatype.number();

      mockEventEmitter2.emit.mockReturnValue(true);
    });

    it('event register', () => {
      expect(event.unfollow(toMemberId, fromMemberId)).toBe(true);

      expect(mockEventEmitter2.emit).toBeCalledWith(
        MEMBER_FOLLOW_DELETE,
        toMemberId,
        fromMemberId,
      );
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
