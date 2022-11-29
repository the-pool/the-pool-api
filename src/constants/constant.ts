import { LessonLevelId } from './enum';

export const titleLength = {
  MIN: 1,
  MAX: 50,
};

export const nicknameLength = {
  MIN: 1,
  MAX: 30,
};

export const LESSON_LEVEL = {
  [LessonLevelId.Top]: '상',
  [LessonLevelId.Middle]: '중',
  [LessonLevelId.Bottom]: '하',
};
