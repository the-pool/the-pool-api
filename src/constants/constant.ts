import { LessonLevelId, MajorId, ModelName } from './enum';

// 멤버 닉네임 길이 제한
export const MEMBER_NICKNAME_LENGTH = {
  // 1
  MIN: 1,
  // 50
  MAX: 50,
} as const;

// 레슨 제목 길이 제한
export const LESSON_TITLE_LENGTH = {
  // 1
  MIN: 1,
  // 30
  MAX: 30,
} as const;

// major text
export const MAJOR_TEXT = {
  // 개발
  [MajorId.Development]: '개발',
  // 디자인
  [MajorId.Development]: '디자인',
} as const;

export const LESSON_LEVEL = {
  // 난이도 상
  [LessonLevelId.Top]: '상',
  // 난이도 중
  [LessonLevelId.Middle]: '중',
  // 난이도 하
  [LessonLevelId.Bottom]: '하',
} as const;

export const SIMILAR_LESSON = {
  LIMIT: 4,
} as const;

export const DOMAIN_TO_MODEL_NAME = {
  lessons: ModelName.Lesson,
};
