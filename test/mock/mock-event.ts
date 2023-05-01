import { MemberFriendshipsEvent } from '@src/modules/member-friendship/events/member-friendships.event';
import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { MockClassType } from '@test/mock/mock.type';

export const mockMemberStatisticsEvent: MockClassType<MemberStatisticsEvent> = {
  register: jest.fn(),
};

export const mockMemberFriendshipsEvent: MockClassType<MemberFriendshipsEvent> =
  {
    follow: jest.fn(),
    unfollow: jest.fn(),
  };
