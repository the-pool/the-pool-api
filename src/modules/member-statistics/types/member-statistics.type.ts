import { Prisma } from '@prisma/client';

export type MemberStatisticsIncrementFieldName = keyof Pick<
  Prisma.MemberStatisticsUpdateInput,
  'lessonCount' | 'feedbackCount' | 'commentCount'
>;
