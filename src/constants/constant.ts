import { LessonLevelId } from '@src/constants/enum';

// 레슨 제목 길이 제한
export const LESSON_TITLE_LENGTH = {
  // 1
  MIN: 1,
  // 30
  MAX: 30,
} as const;

// 레슨 제목 길이 제한
export const SOLUTION_TITLE_LENGTH = {
  // 1
  MIN: 1,
  // 30
  MAX: 30,
} as const;

// 문제=풀이 해시태그 길이 제한
export const SOLUTION_HASHTAG_LENGTH = {
  // 1
  MIN: 1,
  // 15
  MAX: 15,
} as const;

// HTTP ERROR MESSAGE
export const HTTP_ERROR_MESSAGE = {
  FORBIDDEN: 'You do not have access to {modelName}',
  NOT_FOUND: "{modelId} doesn't exist id in {modelName}",
  CONFLICT: '{model} is duplicated',
} as const;

export const LESSON_LEVEL = {
  [LessonLevelId.Top]: 'top',
  [LessonLevelId.Middle]: 'middle',
  [LessonLevelId.Bottom]: 'bottom',
} as const;

// response field name meta data
export const RESPONSE_FIELD_NAME = 'responseFieldName';
