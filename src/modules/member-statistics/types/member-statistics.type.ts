import { Prisma } from '@prisma/client';
import { IncreaseAction } from '@src/types/type';

export type MemberStatisticsIncreaseFieldName = keyof Pick<
  Prisma.MemberStatisticsUpdateInput,
  | 'lessonCount'
  | 'lessonCommentCount'
  | 'solutionCount'
  | 'solutionCommentCount'
  | 'feedbackCount'
>;

export interface IMemberStatisticsEvent {
  fieldName: MemberStatisticsIncreaseFieldName;
  action: IncreaseAction;
  count?: number;
}
