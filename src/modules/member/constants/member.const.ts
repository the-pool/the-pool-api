import { MemberLoginType } from '@src/modules/member/constants/member.enum';

export const MEMBER_ACCOUNT_PREFIX = {
  [MemberLoginType.Kakao]: 'k',
  [MemberLoginType.Google]: 'g',
  [MemberLoginType.Apple]: 'a',
} as const;
