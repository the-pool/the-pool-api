import { MemberLoginType } from '@src/modules/member/constants/member.enum';

export const MEMBER_ACCOUNT_PREFIX = {
  [MemberLoginType.Kakao]: 'k',
  [MemberLoginType.Google]: 'g',
  [MemberLoginType.Apple]: 'a',
  [MemberLoginType.GitHub]: 'gh',
} as const;

export const MEMBER_STATUSES = 'memberStatuses';

export const OWN_MEMBER_FIELD_NAME = 'ownMemberFieldName';

export const UN_OWN_MEMBER_FIELD_NAME = 'unOwnMemberFieldName';

export const MEMBER_JOBS = 'memberJobs';
