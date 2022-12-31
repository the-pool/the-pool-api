import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrivateStorageService } from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { LessonService } from '@src/modules/lesson/services/lesson.service';
import { MajorService } from '@src/modules/major/services/major.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { MockClassType } from './mock.type';

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockMemberService: MockClassType<MemberService> = {
  canLoginOrFail: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  loginByOAuth: jest.fn(),
  updateMember: jest.fn(),
};

export const mockAuthService: MockClassType<AuthService> = {
  createAccessToken: jest.fn(),
  validateOAuth: jest.fn(),
  validateExternalAccessTokenOrFail: jest.fn(),
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
  updateLessonHashtag: jest.fn(),
  readOneLesson: jest.fn(),
};

export const mockMajorService: MockClassType<MajorService> = {
  findMajors: jest.fn(),
  findMajor: jest.fn(),
  findMainSkills: jest.fn(),
  findMainSkill: jest.fn(),
};
