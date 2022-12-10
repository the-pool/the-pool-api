import { LessonRepository } from '@src/modules/lesson/repositories/lesson.repository';
import { MockClassType } from './mock.type';

export const MockLessonRepository: MockClassType<LessonRepository> = {
  readOneLesson: jest.fn(),
  readLessonLevelEvaluation: jest.fn(),
  readLessonHashtag: jest.fn(),
};
