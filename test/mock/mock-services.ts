import { CommentService } from '@src/modules/comment/services/comment.service';
import { AuthService } from '@src/modules/core/auth/services/auth.service';
import { NotificationService } from '@src/modules/core/notification/services/notification.service';
import { PrivateStorageService } from '@src/modules/core/private-storage/interfaces/private-storage-service.interface';
import { ThePoolCacheService } from '@src/modules/core/the-pool-cache/services/the-pool-cache.service';
import { ThePoolConfigService } from '@src/modules/core/the-pool-config/services/the-pool-config.service';
import { LessonBookmarkService } from '@src/modules/lesson/services/lesson-bookmark.service';
import { LessonEvaluationService } from '@src/modules/lesson/services/lesson-evaluation.service';
import { LessonHashtagService } from '@src/modules/lesson/services/lesson-hashtag.service';
import { LessonLikeService } from '@src/modules/lesson/services/lesson-like.service';
import { LessonService } from '@src/modules/lesson/services/lesson.service';
import { MajorService } from '@src/modules/major/services/major.service';
import { MemberFriendshipService } from '@src/modules/member-friendship/services/member-friendship.service';
import { MemberInterestService } from '@src/modules/member-interest/services/member-interest.service';
import { MemberSkillService } from '@src/modules/member-skill/services/member-skill.service';
import { MemberSocialLinkService } from '@src/modules/member-social-link/services/member-social-link.service';
import { MemberStatisticsService } from '@src/modules/member-statistics/services/member-statistics.service';
import { MemberValidationService } from '@src/modules/member/services/member-validation.service';
import { MemberService } from '@src/modules/member/services/member.service';
import { QuestionService } from '@src/modules/question/services/question.service';
import { SolutionHashtagService } from '@src/modules/solution/services/solution-hashtag.service';
import { SolutionService } from '@src/modules/solution/services/solution.service';
import { MockClassType } from '@test/mock/mock.type';

export const mockConfigService = {
  get: jest.fn(),
};

export const mockJwtService = {
  sign: jest.fn(),
};

export const mockMemberService: MockClassType<MemberService> = {
  findOne: jest.fn(),
  findLessonSolutionStatisticsById: jest.fn(),
  findOneOrFail: jest.fn(),
  signUp: jest.fn(),
  login: jest.fn(),
  updateFromPatch: jest.fn(),
  mappingMajor: jest.fn(),
  mappingMajorSkill: jest.fn(),
  mappingMemberSkills: jest.fn(),
  unmappingMemberSkills: jest.fn(),
  mappingMemberInterests: jest.fn(),
  unmappingMemberInterests: jest.fn(),
};

export const mockMemberFriendshipService: MockClassType<MemberFriendshipService> =
  {
    findAll: jest.fn(),
    createFollowing: jest.fn(),
    deleteFollowing: jest.fn(),
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

export const mockMemberSocialLinkService: MockClassType<MemberSocialLinkService> =
  {
    findAll: jest.fn(),
  };

export const mockMemberValidationService: MockClassType<MemberValidationService> =
  {
    canLoginOrFail: jest.fn(),
    canUpdateFromPatchOrFail: jest.fn(),
  };

export const mockAuthService: MockClassType<AuthService> = {
  createAccessToken: jest.fn(),
  validateOAuth: jest.fn(),
  validateExternalAccessTokenOrFail: jest.fn(),
};

export const mockPrivateStorageService: MockClassType<PrivateStorageService> = {
  getSignedUrl: jest.fn(),
};

export const mockLessonService: MockClassType<LessonService> = {
  createLesson: jest.fn(),
  updateLesson: jest.fn(),
  readOneLesson: jest.fn(),
  deleteLesson: jest.fn(),
  readManyLesson: jest.fn(),
};

export const mockLessonHashtagService: MockClassType<LessonHashtagService> = {
  createManyHashtag: jest.fn(),
  updateManyHashtag: jest.fn(),
  deleteManyHashtagByLessonId: jest.fn(),
  deleteManyHashtagByHashtagId: jest.fn(),
  readManyHashtag: jest.fn(),
  readLessonHashtags: jest.fn(),
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
  findAllMajor: jest.fn(),
  findOneMajorOrThrow: jest.fn(),
  findAllMajorSkill: jest.fn(),
  findOneMajorSkillOrThrow: jest.fn(),
};

export const mockQuestionService: MockClassType<QuestionService> = {
  findQuestionCategoryList: jest.fn(),
};

export const mockSolutionService: MockClassType<SolutionService> = {
  findStatisticsByMemberId: jest.fn(),
  createSolution: jest.fn(),
  updateSolution: jest.fn(),
  deleteSolution: jest.fn(),
  readOneSolution: jest.fn(),
  readManySolution: jest.fn(),
};

export const mockSolutionHashtagService: MockClassType<SolutionHashtagService> =
  {
    createManyHashtag: jest.fn(),
    findManyHashtag: jest.fn(),
  };

export const mockLessonBookmarkService: MockClassType<LessonBookmarkService> = {
  createBookmark: jest.fn(),
  deleteBookmark: jest.fn(),
};

export const mockCommentService: MockClassType<CommentService> = {
  createComment: jest.fn(),
  deleteComment: jest.fn(),
  updateComment: jest.fn(),
  readManyComment: jest.fn(),
};
export const mockLessonLikeService: MockClassType<LessonLikeService> = {
  createLike: jest.fn(),
  deleteLike: jest.fn(),
};

export const mockNotificationService: MockClassType<NotificationService> = {
  send: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
};

export const mockThePoolCacheService: MockClassType<ThePoolCacheService> = {
  onModuleInit: jest.fn(),
  getMemberSocialLinks: jest.fn(),
  setMemberSocialLinks: jest.fn(),
};

export const mockThePoolConfigService: MockClassType<ThePoolConfigService> = {
  get: jest.fn(),
  getAll: jest.fn(),
  getAllMap: jest.fn(),
  isDevelopment: jest.fn(),
  isLocal: jest.fn(),
  isProduction: jest.fn(),
};
