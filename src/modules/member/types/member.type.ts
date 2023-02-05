import { MajorId } from '@src/constants/enum';
import { MemberStatus } from '@src/modules/member/constants/member.enum';

export type AccessToken = { accessToken: string };

export type MemberStatuses = [MemberStatus, MemberStatus?, MemberStatus?];

export type MemberMajors = [MajorId?, MajorId?];
