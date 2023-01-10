import { LessonRepository } from '@src/modules/lesson/repositories/lesson.repository';
import { MockClassType } from './mock.type';

export const mockLessonRepository: MockClassType<LessonRepository> = {
  readOneLesson: jest.fn(),
  readSimilarLesson: jest.fn(),
};
