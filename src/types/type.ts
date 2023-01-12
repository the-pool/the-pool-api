import { Type } from '@nestjs/common';
import {
  Lesson,
  LessonBookmark,
  LessonComment,
  LessonHashtag,
  LessonLevel,
  LessonLevelEvaluation,
  LessonSolution,
  MainSkill,
  Major,
  Member,
  MemberFollow,
  MemberReport,
  MemberSkill,
  Post,
  Prisma,
  User,
} from '@prisma/client';
import { JwtAuthGuard } from '@src/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@src/guards/optional-auth-guard';

export type PrismaModelName = Uncapitalize<Prisma.ModelName>;

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
  | MainSkill
  | Major
  | Member
  | MemberReport
  | MemberFollow
  | Lesson
  | LessonLevelEvaluation
  | LessonBookmark
  | LessonSolution
  | LessonLevel
  | LessonHashtag
  | LessonComment
  | MemberSkill
  | Post
  | User;

export type Target<M extends PrismaModel = PrismaModel> = {
  model?: PrismaModelName;
  field?: keyof M;
};

export type MajorText = '개발' | '디자인';

export type JwtGuard = typeof JwtAuthGuard | typeof OptionalJwtAuthGuard;

export type OptionalProperty = {
  isArray?: boolean;
  nullable?: boolean;
  deprecated?: boolean;
  title?: string;
  description?: string;
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
