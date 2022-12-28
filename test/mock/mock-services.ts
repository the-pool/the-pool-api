import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrismaHelper } from '@src/modules/core/database/prisma/prisma.helper';
import { PrismaService } from '@src/modules/core/database/prisma/prisma.service';
import { PrivateStorageService } from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { LessonHashtagService } from '@src/modules/lesson/services/lesson-hashtag.service';
import { LessonService } from '@src/modules/lesson/services/lesson.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { MockClassType } from './mock.type';

export const mockMemberService: MockClassType<MemberService> = {
  loginByOAuth: jest.fn(),
  updateMember: jest.fn(),
};
export const mockAuthService: MockClassType<AuthService> = {
  login: jest.fn(),
  createAccessToken: jest.fn(),
  validateOAuth: jest.fn(),
};
export const mockHttpService = {
  get: jest.fn(() => mockAuthService),
  pipe: jest.fn(),
};

export const mockPrivateStorageService: MockClassType<PrivateStorageService> = {
  getSignedUrl: jest.fn(),
};

export const mockLessonService: MockClassType<LessonService> = {
  createLesson: jest.fn(),
  updateLesson: jest.fn(),
  readOneLesson: jest.fn(),
  readSimilarLesson: jest.fn(),
  deleteLesson: jest.fn(),
};

export const mockLessonHashtagService: MockClassType<LessonHashtagService> = {
  createHashtag: jest.fn(),
  updateManyHashtag: jest.fn(),
  updateHashtag: jest.fn(),
  deleteManyHashtag: jest.fn(),
  deleteHashtag: jest.fn(),
  readHashtag: jest.fn(),
  readManyHashtag: jest.fn(),
};
