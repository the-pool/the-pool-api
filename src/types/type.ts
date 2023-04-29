import { Type } from '@nestjs/common';
import {
  Lesson,
  LessonBookmark,
  LessonComment,
  LessonHashtag,
  LessonLevel,
  LessonLevelEvaluation,
  LessonSolution,
  Major,
  MajorSkill,
  Member,
  MemberFollow,
  MemberSkill,
  MemberStatistics,
  Prisma,
  LessonHashtagMapping,
  LessonSolutionComment,
} from '@prisma/client';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';
import { LessonCommentEntity } from '@src/modules/lesson/entities/lesson-comment.entity';
import { SolutionCommentEntity } from '@src/modules/solution/entities/solution-comment.entity';

export type PrismaModelName = Uncapitalize<Prisma.ModelName>;

// 댓글 관련 테이블은 항상 Comment로 끝나도록 네이밍 해야 함
export type PrismaCommentModelName = Extract<
  PrismaModelName,
  `${string}Comment`
>;

// 댓글 기능을 추가할 때마다 댓글 테이블과 prisma에서 생성해주는 댓글 모델의 매핑관계를 만들어 주어야 함
export type PrismaCommentModelMapper = {
  lessonComment: LessonCommentEntity;
  lessonSolutionComment: SolutionCommentEntity;
};

// 댓글 기능을 추가할 때마다 댓글을 가지고 있는 부모 테이블이 Extract의 두번째 유니온으로 추가 되어야 함
export type PrismaCommentParentIdColumn = Record<
  `${Extract<PrismaModelName, 'lesson' | 'lessonSolution'>}Id`,
  number
>;
/**
 * @todo Prisma의 WhereInput 타입들을 모아놓은 타입입니다.
 */
// export type PrismaWhereInput =
//   | Prisma.PostWhereInput
//   | Prisma.UserWhereInput
//   | Prisma.MajorWhereInput
//   | Prisma.LessonWhereInput
//   | Prisma.MainSkillWhereInput
//   | Prisma.LessonLikeWhereInput
//   | Prisma.PostScalarWhereInput
//   | Prisma.LessonLevelWhereInput
//   | Prisma.MemberSkillWhereInput
//   | Prisma.LessonScalarWhereInput
//   | Prisma.MemberFollowWhereInput
//   | Prisma.MemberReportWhereInput
//   | Prisma.MemberScalarWhereInput;

export type PrismaModel =
  | MajorSkill
  | Major
  | Member
  | MemberStatistics
  | MemberFollow
  | Lesson
  | LessonLevelEvaluation
  | LessonBookmark
  | LessonSolution
  | LessonLevel
  | LessonHashtag
  | LessonHashtagMapping
  | LessonComment
  | MemberSkill
  | LessonComment
  | LessonSolutionComment;

export type Target<M extends PrismaModel = PrismaModel> = {
  model?: PrismaModelName;
  field?: keyof M;
};

export type IncreaseAction = 'increment' | 'decrement';

export type MajorText = '개발' | '디자인';

export type JwtGuard = typeof JwtAuthGuard | typeof OptionalJwtAuthGuard;

export type OptionalProperty = {
  isArray?: boolean;
  nullable?: boolean;
  deprecated?: boolean;
  title?: string;
  description?: string;
  maximum?: number;
  minimum?: number;
  maxLength?: number;
  minLength?: number;
  maxItems?: number;
  minItems?: number;
  uniqueItems?: boolean;
  maxProperties?: number;
  minProperties?: number;
  enum?: any[];
  default?: any;
};

export type Reference = OptionalProperty & {
  type: Type<unknown>;
};

export type Primitive = OptionalProperty & {
  type: string | Record<string, any>;
  example?: any;
};

export type VirtualColumnCount = {
  _count: Prisma.SortOrder;
};
