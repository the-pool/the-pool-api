import { MemberStatisticsEvent } from '@src/modules/member-statistics/events/member-statistics.event';
import { MockClassType } from '@test/mock/mock.type';

export const mockMemberStatisticsEvent: MockClassType<MemberStatisticsEvent> = {
  register: jest.fn(),
};
