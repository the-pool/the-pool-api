import { SolutionVirtualColumn } from './solution.enum';

export const SOLUTION_VIRTUAL_COLUMN_FOR_READ_MANY = {
  [SolutionVirtualColumn.LessonSolutionComments]:
    SolutionVirtualColumn.LessonSolutionComments,
  [SolutionVirtualColumn.LessonSolutionLikes]:
    SolutionVirtualColumn.LessonSolutionLikes,
} as const;
