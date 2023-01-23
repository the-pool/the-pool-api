import { LessonVirtualColumn } from './lesson.enum';

/**
 * 과제 목록 조회중 가상 컬럼으로 sorting을 위한 객체
 */
export const LessonVirtualColumnForReadMany = {
  [LessonVirtualColumn.LessonSolution]: LessonVirtualColumn.LessonSolution,
  [LessonVirtualColumn.LessonComment]: LessonVirtualColumn.LessonComment,
  [LessonVirtualColumn.LessonLike]: LessonVirtualColumn.LessonLike,
} as const;
