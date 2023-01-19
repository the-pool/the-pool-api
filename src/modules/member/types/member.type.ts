export type AccessToken = { accessToken: string };
import { MemberStatus } from '@src/modules/member/constants/member.enum';


export type MemberStatuses = [MemberStatus, MemberStatus?, MemberStatus?];
