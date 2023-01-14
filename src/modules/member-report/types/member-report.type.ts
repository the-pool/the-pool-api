import { Prisma } from '@prisma/client';

export type MemberReportIncrementFieldName = keyof Omit<
  Prisma.MemberReportUpdateInput,
  'followerCount' | 'followingCount' | 'rank' | 'point' | 'member'
>;
