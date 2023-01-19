import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { PrivateStorageService } from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { LessonEvaluationService } from '@src/modules/lesson/services/lesson-evaluation.service';
import { LessonHashtagService } from '@src/modules/lesson/services/lesson-hashtag.service';
import { LessonService } from '@src/modules/lesson/services/lesson.service';
import { MajorService } from '@src/modules/major/services/major.service';
import { MemberFriendshipService } from '@src/modules/member-friendship/services/member-friendship.service';
import { MemberInterestService } from '@src/modules/member-interest/services/member-interest.service';
import { MemberSkillService } from '@src/modules/member-skill/services/member-skill.service';
import { MemberStatisticsService } from '@src/modules/member-statistics/services/member-statistics.service';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { MockClassType } from './mock.type';

export const mockConfigService = {
  get: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockMemberService: MockClassType<MemberService> = {
  findOne: jest.fn(),
  signUp: jest.fn(),
  login: jest.fn(),
  updateFromPatch: jest.fn(),
  mappingMajor: jest.fn(),
  loginByOAuth: jest.fn(),
  updateMember: jest.fn(),
};

export const mockMemberFriendshipService: MockClassType<MemberFriendshipService> =
  {
    findAll: jest.fn(),
  };

export const mockMemberStatisticsService: MockClassType<MemberStatisticsService> =
  {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

export const mockMemberInterestService: MockClassType<MemberInterestService> = {
  findAll: jest.fn(),
};

export const mockMemberSkillService: MockClassType<MemberSkillService> = {
  findAll: jest.fn(),
};

export const mockMemberValidationService: MockClassType<MemberValidationService> =
  {
    canLoginOrFail: jest.fn(),
    canCreateOrFail: jest.fn(),
    canUpdateFromPatchOrFail: jest.fn(),
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
  readOneLesson: jest.fn(),
  readSimilarLesson: jest.fn(),
  deleteLesson: jest.fn(),
};

export const mockLessonHashtagService: MockClassType<LessonHashtagService> = {
  createManyHashtag: jest.fn(),
  updateManyHashtag: jest.fn(),
  updateOneHashtag: jest.fn(),
  deleteManyHashtag: jest.fn(),
  deleteOneHashtag: jest.fn(),
  readOneHashtag: jest.fn(),
  readManyHashtag: jest.fn(),
};

export const mockLessonEvaluationService: MockClassType<LessonEvaluationService> =
  {
    createEvaluation: jest.fn(),
    updateEvaluation: jest.fn(),
    readCountedEvaluation: jest.fn(),
    readMemberEvaluation: jest.fn(),
    readManyEvaluation: jest.fn(),
  };

export const mockMajorService: MockClassType<MajorService> = {
  findMajors: jest.fn(),
  findMajor: jest.fn(),
  findMajorSkills: jest.fn(),
  findMajorSkill: jest.fn(),
};
