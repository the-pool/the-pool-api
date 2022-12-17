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
