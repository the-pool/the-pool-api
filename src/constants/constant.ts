import { MajorId } from './enum';

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

// HTTP ERROR MESSAGE
export const HTTP_ERROR_MESSAGE = {
  FORBIDDEN: 'You do not have access to {modelName}',
  NOT_FOUND: "{modelId} doesn't exist id in {modelName}",
};

// member report increment meta data
export const MEMBER_REPORT_INCREMENT_FIELD_NAME =
  'memberReportIncrementFieldName';

// response field name meta data
export const RESPONSE_FIELD_NAME = 'responseFieldName';
