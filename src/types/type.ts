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
  MemberReport,
  MemberSkill,
  Prisma,
} from '@prisma/client';

export type PrismaModelName = Uncapitalize<Prisma.ModelName>;

export type PrismaModel =
  | MajorSkill
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
  | MemberSkill;

export type Target<M extends PrismaModel = PrismaModel> = {
  model?: PrismaModelName;
  field?: keyof M;
};

export type MajorText = '개발' | '디자인';
