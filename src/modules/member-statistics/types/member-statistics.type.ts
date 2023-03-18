import { Prisma } from '@prisma/client';

export type MemberStatisticsIncreaseFieldName = keyof Pick<
  Prisma.MemberStatisticsUpdateInput,
  'lessonCount' | 'solutionCount' | 'feedbackCount' | 'commentCount'
>;
