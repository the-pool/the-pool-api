import { LessonVirtualColumn } from './lesson.enum';

/**
 * 과제 목록 조회중 가상 컬럼으로 sorting을 위한 객체
 */
export const LESSON_VIRTUAL_COLUMN_FOR_READ_MANY = {
  [LessonVirtualColumn.LessonSolutions]: LessonVirtualColumn.LessonSolutions,
  [LessonVirtualColumn.LessonComments]: LessonVirtualColumn.LessonComments,
  [LessonVirtualColumn.LessonLikes]: LessonVirtualColumn.LessonLikes,
  [LessonVirtualColumn.LessonBookmarks]: LessonVirtualColumn.LessonBookmarks,
} as const;
