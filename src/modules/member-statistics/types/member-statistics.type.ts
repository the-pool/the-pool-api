import { Prisma } from '@prisma/client';

export type MemberStatisticsIncreaseFieldName = keyof Pick<
  Prisma.MemberStatisticsUpdateInput,
  | 'lessonCount'
  | 'lessonCommentCount'
  | 'solutionCount'
  | 'solutionCommentCount'
  | 'feedbackCount'
>;
