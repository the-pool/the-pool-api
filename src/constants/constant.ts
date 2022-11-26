import { MajorId } from '@src/constants/enum';

// 멤버 닉네임 길이 제한
export const MEMBER_NICKNAME_LENGTH = {
  // 1
  MIN: 1,
  // 50
  MAX: 50,
};

// 레슨 제목 길이 제한
export const LESSON_TITLE_LENGTH = {
  // 1
  MIN: 1,
  // 30
  MAX: 30,
};

// major text
export const MAJOR_TEXT = {
  // 개발
  [MajorId.Development]: '개발',
  // 디자인
  [MajorId.Development]: '디자인',
};
