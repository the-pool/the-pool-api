import {
  Lesson,
  LessonBookMark,
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

export type PrismaModelName = Lowercase<Prisma.ModelName>;

export type PrismaModel =
  | MainSkill
  | Major
  | Member
  | MemberReport
  | MemberFollow
  | Lesson
  | LessonLevelEvaluation
  | LessonSolution
  | LessonBookMark
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
